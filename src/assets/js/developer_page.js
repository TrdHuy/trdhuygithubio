const contract = window.TRD_CONTRACT
const loadDeveloperReportsBtn = document.querySelector("[load-developer-report-btn]");
const folderPath = 'CoverageReport';
const loader = document.getElementById("loader");
const inputFormUrl = "developer_token_input.html"

function showLoader(isShow) {
     if (isShow === true) {
          loader.classList.add('active')
     } else {
          loader.classList.remove('active')
     }
}
function ticksToDate(ticks) {
     const ticksPerSecond = 10000000;
     const unixEpochTicks = 621355968000000000;
     const unixTime = (ticks - unixEpochTicks) / ticksPerSecond;
     return new Date(unixTime * 1000).toLocaleString();
}

loadDeveloperReportsBtn.addEventListener("click", function () {
     window.showTopWindowInputForm(inputFormUrl, submitCallback);
})

window.addEventListener('load', function (event) {
     const cachedFiles = localStorage.getItem(contract.LOCAL_STORAGE_KEY.GITHUB_DATA_TREE);
     if (cachedFiles) {
          const files = JSON.parse(cachedFiles);
          const filteredFiles = files.filter(item => item.path.startsWith(folderPath) && item.type === 'blob' && item.path.endsWith('index.html'));
          displayFiles(filteredFiles, files);

     }
});

async function submitCallback(token) {
     showLoader(true);
     window.hideTopWindowInputForm(inputFormUrl);
     await loadFiles(token);
     const cachedFiles = localStorage.getItem(contract.LOCAL_STORAGE_KEY.GITHUB_DATA_TREE);
     if (cachedFiles) {
          const files = JSON.parse(cachedFiles);
          const filteredFiles = files.filter(item => item.path.startsWith(folderPath) && item.type === 'blob' && item.path.endsWith('index.html'));
          await displayFiles(filteredFiles, files);
     }
     showLoader(false);
}
async function displayFiles(files, allFiles) {
     const fileTableBody = document.getElementById('fileTableBody');
     const fileTableSpaceRow = document.getElementById('fileTableSpaceRow');

     fileTableBody.innerHTML = fileTableSpaceRow.outerHTML;

     for (const file of files) {
          const pathParts = file.path.split('/');
          const projectName = pathParts[pathParts.length - 3];
          const timestamp = pathParts[pathParts.length - 2];
          const creationDate = ticksToDate(parseInt(timestamp));

          const propertiesJsonPath = pathParts.slice(0, -1).concat('properties.json').join('/');
          let propertiesFile = allFiles.find(f => f.path === propertiesJsonPath);
          let propertiesContent = 'N/A';

          if (propertiesFile) {
               cacheContent = propertiesFile.cacheContent
               if (!cacheContent) {
                    try {
                         const response = await fetch(propertiesFile.url);
                         const json = await response.json();
                         const contentBase64 = json.content;
                         const content = atob(contentBase64);
                         propertiesContent = JSON.stringify(JSON.parse(content), null, 2);
                         propertiesFile.cacheContent = propertiesContent
                         cacheContent = propertiesContent
                    } catch (error) {
                         propertiesContent = 'Error loading properties';
                    }
               }
               propertiesContent = cacheContent
          }
          const row = document.createElement('tr');
          const pathCell = document.createElement('td');
          const projectCell = document.createElement('td');
          const dateCell = document.createElement('td');
          const propertiesCell = document.createElement('td');

          const pathLink = document.createElement('a');
          pathLink.href = `https://trdhuy.github.io/${file.path}`;
          pathLink.textContent = file.path;
          pathLink.target = '_blank';
          pathCell.appendChild(pathLink);

          projectCell.textContent = projectName;
          dateCell.textContent = creationDate;
          propertiesCell.textContent = propertiesContent;

          row.appendChild(pathCell);
          row.appendChild(projectCell);
          row.appendChild(dateCell);
          row.appendChild(propertiesCell);

          fileTableBody.appendChild(row);
     }

     document.getElementById('fileTable').style.display = 'table';
}

async function loadFiles(token) {
     const user = 'TrdHuy';
     const repo = 'TrdHuy.github.io';
     const branch = 'master';
     const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;

     try {
          const response = await fetch(url, {
               headers: {
                    'Authorization': `token ${token}`
               }
          });

          if (response.ok) {
               const data = await response.json();
               localStorage.setItem(TRD_CONTRACT.LOCAL_STORAGE_KEY.GITHUB_DATA_TREE,
                    JSON.stringify(data.tree));
          } else {
               alert('Failed to fetch files. Please check your token and repo path.');
          }
     } catch (error) {
          console.error('Error fetching files:', error);
          alert('An error occurred. Please try again.');
     } finally {
          // hideLoading();
     }
}