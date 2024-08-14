class LoadingImage extends HTMLElement {
     constructor() {
          super();
          this.host = this.attachShadow({ mode: 'closed' });
          const shadowRoot = this.host;
          shadowRoot.host.style.overflow = 'clip';
          shadowRoot.host.style.display = 'flex';
          shadowRoot.host.style.justifyContent = 'center';
          shadowRoot.host.style.alignItems = 'center';

          // Tạo container
          this.container = document.createElement('div');
          const container = this.container;
          container.className = 'image-container';

          // Tạo spinner
          this.spinerContainer = document.createElement('div');
          this.spinerContainer.style.width = '300px';
          this.spinerContainer.style.top = '50%';
          this.spinerContainer.style.display = 'flex';
          this.spinerContainer.style.justifyContent = 'center';
          this.spinner = document.createElement('div');
          const spinner = this.spinner;
          spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
          spinner.style.borderLeftColor = '#000';
          spinner.style.borderRadius = '50%';
          spinner.style.width = '50px';
          spinner.style.height = '50px';
          spinner.style.zIndex = '10';
          spinner.style.animation = 'spin 1s linear infinite';

          // Tạo thẻ img
          this.img = document.createElement('img');
          const img = this.img;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          img.style.display = 'none';

          // Đặt thuộc tính src từ thuộc tính của custom element
          this.imgSrc = this.getAttribute('src');
          const altText = this.getAttribute('alt');
          img.alt = altText;

          img.onload = () => {
               spinner.style.display = 'none';
               img.style.display = 'block';

               // Cập nhật tỷ lệ của container dựa trên tỷ lệ của ảnh
               const aspectRatio = img.naturalWidth / img.naturalHeight;
               const parentWidth = 0;
               const parentHeight = shadowRoot.host.clientHeight;
               if (parentWidth != 0 && parentHeight != 0) {
                    if (parentWidth / parentHeight > aspectRatio) {
                         container.style.height = `${parentHeight}px`;
                         container.style.width = `${parentHeight * aspectRatio}px`;
                    } else {
                         container.style.width = `${parentWidth}px`;
                         container.style.height = `${parentWidth / aspectRatio}px`;
                    }
               } else if (parentHeight != 0) {
                    container.style.height = `${parentHeight}px`;
                    container.style.width = `${parentHeight * aspectRatio}px`;
               }

          };

          img.onerror = () => {
               spinner.style.display = 'none';
               console.error('Image failed to load');
          };

          img.style.display = 'none';
          this.spinerContainer.appendChild(spinner);
          container.appendChild(this.spinerContainer);
          container.appendChild(img);

          const style = document.createElement('style');
          style.textContent = `@keyframes spin{0%{transform:rotate(0deg);}100% {transform: rotate(360deg);}}`;

          shadowRoot.append(style, container);
     }

     connectedCallback() {
          const customContainer = this.closest('hor-image-container');
          // Nếu ở bên trong custom-image-container thì apply cơ chế lazy load theo IntersectionObserver 
          if (customContainer) {
               const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                         if (entry.isIntersecting) {
                              setTimeout(() => {
                                   this.img.src = this.imgSrc;
                              }, 2000); // Delay for demonstration, can be removed
                              observer.unobserve(this);
                         }
                    });
               }, {
                    root: null, // set null thì element sẽ dựa theo kích thước cửa sổ 
                    threshold: 0.1 // 10% of the image is visible
               });

               observer.observe(this);
          } else {
               this.img.src = this.imgSrc;
          }

     }

}
customElements.define('loading-image', LoadingImage);