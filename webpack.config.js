const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const fs = require('fs');
const crypto = require('crypto');
const CopyWebpackPlugin = require('copy-webpack-plugin');

class ReplaceJsonPathsPlugin {
  constructor() {
    this.assetMap = new Map();
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ReplaceJsonPathsPlugin', (compilation) => {
      // Hook into the processing of assets to capture original and hashed names
      compilation.hooks.processAssets.tap({
        name: 'ReplaceJsonPathsPlugin',
        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
      }, (assets) => {
        for (const assetName in assets) {
          // Chỉ xử lý các file hình ảnh
          if (assetName.match(/\.(png|jpe?g|gif|svg)$/)) {
            const assetInfo = compilation.getAsset(assetName);
            let sourcePath = assetInfo.info.sourceFilename; // Lấy đường dẫn gốc
            const newAssetPath = assetName; // Đường dẫn sau khi bị hash

            // Loại bỏ 'src/' ở đầu nếu tồn tại
            if (sourcePath.startsWith('src/')) {
              sourcePath = sourcePath.substring(4);
            }

            // Chuyển đổi đường dẫn để bắt đầu bằng './'
            const formattedSourcePath = './' + path.posix.normalize(sourcePath).replace(/\\/g, '/');
            const formattedNewAssetPath = './' + path.posix.normalize(newAssetPath).replace(/\\/g, '/');

            // Lưu vào map với key là đường dẫn gốc và value là đường dẫn đã hash
            this.assetMap.set(formattedSourcePath, formattedNewAssetPath);
          }
        }
      });
    });

    compiler.hooks.emit.tapAsync('ReplaceJsonPathsPlugin', (compilation, callback) => {
      const assets = Object.keys(compilation.assets);

      // Lấy ra danh sách các file JSON từ assets
      assets.forEach((asset) => {
        if (asset.endsWith('.json')) {
          const assetPath = compilation.assets[asset].source();

          let jsonContent = JSON.parse(assetPath);

          // Thay thế đường dẫn hình ảnh trong JSON
          jsonContent = jsonContent.map(item => {
            // Duyệt qua tất cả các thuộc tính của đối tượng
            for (let key in item) {
              if (item.hasOwnProperty(key)) {
                const originalValue = item[key];
                const newValue = this.assetMap.get(originalValue);

                if (newValue) {
                  item[key] = newValue; // Thay thế giá trị bằng giá trị mới nếu tìm thấy
                }
              }
            }
            return item;
          });

          // Ghi đè nội dung JSON đã chỉnh sửa
          const updatedJsonContent = JSON.stringify(jsonContent, null, 2);
          compilation.assets[asset] = {
            source: () => updatedJsonContent,
            size: () => updatedJsonContent.length
          };
        }
      });

      callback();
    });
  }
}
class RemoveLocalLinksAndScriptsPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('RemoveUnwantedTagsPlugin', (compilation) => {
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'RemoveUnwantedTagsPlugin',
        (data, callback) => {
          let htmlContent = data.html;

          // Loại bỏ tất cả các thẻ <script> có src bắt đầu bằng './assets/js/'
          htmlContent = htmlContent.replace(/<script\b[^>]*src="\.\/assets\/js\/[^"]*"[^>]*><\/script>/gi, '');
          htmlContent = htmlContent.replace(/<script\b[^>]*src="\.\/assets\/jscc\/[^"]*"[^>]*><\/script>/gi, '');

          // Loại bỏ tất cả các thẻ <link> có href bắt đầu bằng './assets/css/'
          htmlContent = htmlContent.replace(/<link\b[^>]*href="\.\/assets\/css\/[^"]*"[^>]*>/gi, '');

          // Cập nhật lại nội dung HTML sau khi xóa
          data.html = htmlContent;
          callback(null, data);
        }
      );
    });
  }
}

class ReplaceClassPlugin {
  constructor(classMappingsCache) {
    this.classMappingsCache = classMappingsCache;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ReplaceClassPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'ReplaceClassPlugin',
        (data, callback) => {
          // Sử dụng cache trực tiếp để thay thế các lớp CSS trong thuộc tính class của HTML
          let htmlContent = data.html;

          // Regex để tìm các thuộc tính class="..."
          const classAttributeRegex = /class=["']([^"']+)["']/g;

          // Thay thế các tên lớp trong thuộc tính class
          htmlContent = htmlContent.replace(classAttributeRegex, (match, classNames) => {
            // Tách các class ra thành một mảng
            const classes = classNames.split(/\s+/);

            // Thay thế các tên lớp dựa trên mappings
            const replacedClasses = classes.map(originalClass => {
              for (const mappings of Object.values(this.classMappingsCache)) {
                if (mappings[originalClass]) {
                  return mappings[originalClass];
                }
              }
              return originalClass; // Trả về lớp gốc nếu không tìm thấy trong mappings
            });

            // Ghép lại thành chuỗi và trả về thay thế cho thuộc tính class
            return `class="${replacedClasses.join(' ')}"`;
          });

          // Cập nhật lại nội dung HTML
          data.html = htmlContent;
          callback(null, data);
        }
      );
    });
  }
}

const classMappingsCache = {};

const jsEntry = {
  ...glob
    .sync('./src/assets/js/*.js')
    .reduce((acc, entry) => {
      const entryName = path.basename(entry, path.extname(entry));
      acc[entryName] = path.resolve(__dirname, entry);
      return acc;
    }, {}),
  ...glob
    .sync('./src/assets/si/*.si.js')
    .reduce((acc, entry) => {
      const entryName = path.basename(entry, path.extname(entry));
      acc[entryName] = path.resolve(__dirname, entry);
      return acc;
    }, {}),
  ...glob
    .sync('./src/assets/jscc/*.jscc.js')
    .reduce((acc, entry) => {
      const entryName = path.basename(entry, path.extname(entry));
      acc[entryName] = path.resolve(__dirname, entry);
      return acc;
    }, {}),
};


function generateHtmlPlugins() {
  const templateFiles = glob.sync('./src/**/*.html').filter((item) => {
    const fileName = path.basename(item);
    return !fileName.includes('test__'); // Loại bỏ các file có chứa 'test__'
  });
  return templateFiles.map((item) => {
    item = item.replace(/\\/g, '/');
    const parts = item.split('/');
    const name = parts[parts.length - 1].split('.')[0];

    let relatedChunks;
    // if (name == 'index') {
    //   relatedChunks = Object.keys(jsEntry).filter((chunkName) =>
    //     chunkName.includes(name)
    //   );
    // } else {
    //   relatedChunks = Object.keys(jsEntry).filter((chunkName) =>
    //     chunkName.includes(name) || chunkName.includes('common')
    //   );
    // }
    relatedChunks = Object.keys(jsEntry).filter((chunkName) =>
      chunkName.includes(name) || chunkName.includes('common')
    );
    relatedChunks.push('contract');

    return new HtmlWebpackPlugin({
      template: path.resolve(__dirname, item),
      filename: `${name}.html`,
      chunks: relatedChunks,
      chunksSortMode: (chunk1, chunk2) => {
        // Ưu tiên 'contract' đứng đầu tiên
        if (chunk1 === 'contract') return -1;
        if (chunk2 === 'contract') return 1;

        // Ưu tiên các chunk chứa 'common' sau 'contract'
        if (chunk1.includes('common') && !chunk2.includes('common')) return -1;
        if (!chunk1.includes('common') && chunk2.includes('common')) return 1;

        return 0; // Giữ nguyên thứ tự cho các chunk khác
      },
    });
  });
}
const htmlPlugins = generateHtmlPlugins();
const nonHashedClassesPath = path.resolve(__dirname, 'non-hashed-classes.json');
const nonHashedClasses = JSON.parse(fs.readFileSync(nonHashedClassesPath, 'utf-8')).classes;

function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: jsEntry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[contenthash].bundle.js' : '[name].js',
      clean: true,
    },
    module: {
      rules: [
        // {
        //   test: /\.(.*)$/, // Phù hợp với tất cả các tệp
        //   type: 'asset/resource', // Đối xử với các tệp như tài nguyên
        //   include: path.resolve(__dirname, 'src/data/codesample/pat'), // Chỉ xử lý thư mục data/codesample
        //   generator: {
        //     filename: '[path][name][ext]' // Lưu các tệp vào thư mục codesample trong dist
        //   }
        // },
        {
          test: /\.json$/,
          type: 'asset/resource',
          include: path.resolve(__dirname, 'src/data'),
          generator: {
            filename: 'data/[name][ext]' // Giữ nguyên tên file và cấu trúc đường dẫn
          }
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              // Tùy chọn này có thể bỏ qua xử lý tự động các thẻ script và link
              sources: {
                list: [
                  // Giữ lại xử lý tự động của hình ảnh và các nguồn tài nguyên khác
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                  },
                  {
                    tag: 'loading-image',
                    attribute: 'src',
                    type: 'src',
                  },
                  // Chặn việc xử lý các thẻ script và link với các đường dẫn cụ thể
                  {
                    tag: 'script',
                    attribute: 'src',
                    type: 'src',
                    filter: (tag, attribute, attributes) => {
                      const srcAttr = attributes.find(attr => attr.name === 'src');
                      return srcAttr ? !/\.\/assets\/js\//.test(srcAttr.value) : true;
                    },
                  },
                  {
                    tag: 'script',
                    attribute: 'src',
                    type: 'src',
                    filter: (tag, attribute, attributes) => {
                      const srcAttr = attributes.find(attr => attr.name === 'src');
                      return srcAttr ? !/\.\/assets\/jscc\//.test(srcAttr.value) : true;
                    },
                  },
                  {
                    tag: 'link',
                    attribute: 'href',
                    type: 'src',
                    filter: (tag, attribute, attributes) => {
                      const hrefAttr = attributes.find(attr => attr.name === 'href');
                      return hrefAttr ? !/\.\/assets\/css\//.test(hrefAttr.value) : true;
                    },
                  },
                ],
              },
            },
          }],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  getLocalIdent: (context, localIdentName, localName, options) => {

                    const hash = generateHash(
                      context.resourcePath + localName
                    );
                    const className = `_${hash.substring(9, 14)}_${hash.substring(0, 8)}`;

                    // Lưu mappings vào cache thay vì ghi tệp liên tục
                    const cssFileName = path.basename(context.resourcePath);

                    if (!classMappingsCache[cssFileName]) {
                      classMappingsCache[cssFileName] = {};
                    }

                    classMappingsCache[cssFileName][localName] = className;
                    if (nonHashedClasses.includes(localName)) {
                      classMappingsCache[cssFileName][localName] = localName;
                      return localName;
                    }
                    return className;
                  },
                },
                sourceMap: true,
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[hash][ext][query]',
          },
        },
      ],
    },
    plugins: [
      ...htmlPlugins,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/data/codesample'),
            to: path.resolve(__dirname, 'dist/data/codesample') // Sao chép các tệp vào thư mục output
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[contenthash].css' : '[name].css',
      }),
      new ReplaceJsonPathsPlugin(),
      new RemoveLocalLinksAndScriptsPlugin(),
      new ReplaceClassPlugin(classMappingsCache), // Truyền mappings vào plugin
      {
        apply: (compiler) => {
          compiler.hooks.emit.tapAsync('SaveClassMappingsPlugin', (compilation, callback) => {
            if (!isProduction) {
              const jsonFilePath = path.resolve(__dirname, 'bin/classMappings.json');
              fs.writeFileSync(
                jsonFilePath,
                JSON.stringify(classMappingsCache, null, 2)
              );
            }

            callback();
          });
        }
      }
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
      removeEmptyChunks: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    stats: {
      children: true,
      errorDetails: true,
    },
    devtool: isProduction ? false : 'source-map',
  };
};
