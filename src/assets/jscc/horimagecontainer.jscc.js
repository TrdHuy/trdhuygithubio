class HorImageContainer extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        document.documentElement.style.setProperty('--scroll-bar-height', '8px');
        document.documentElement.style.setProperty('--scroll-bar-track-bg', '#f1f1f1');
        document.documentElement.style.setProperty('--scroll-bar-thumb-bg', '#888');
        document.documentElement.style.setProperty('--scroll-bar-thumb-border-rad', '10px');
        document.documentElement.style.setProperty('--scroll-bar-track-border-rad', '10px');
        document.documentElement.style.setProperty('--scroll-bar-thumb-bg-hover', '#555');
        document.documentElement.style.setProperty('--scroll-bar-margin', '10px');
        document.documentElement.style.setProperty('--wheel-scroll-velocity', '4');
        document.documentElement.style.setProperty('--disable-wheel-scroll', '0');

        const scrollPanel = document.createElement('div');
        scrollPanel.className = 'scroll-panel';
        scrollPanel.style.position = 'relative';
        scrollPanel.style.width = 'fit-content';
        scrollPanel.style.maxWidth = '100%';
        scrollPanel.style.overflow = 'hidden';
        scrollPanel.style.cursor = 'grab';
        scrollPanel.style.userSelect = 'none';

        this.imageContainer = document.createElement('div');
        const imageContainer = this.imageContainer;
        imageContainer.className = 'image-container';
        imageContainer.style.display = 'flex';
        imageContainer.style.overflowX = 'hidden';
        imageContainer.style.whiteSpace = 'nowrap';
        imageContainer.style.scrollBehavior = 'smooth';
        // Nhập nội dung từ slot
        const slot = document.createElement('slot');
        imageContainer.appendChild(slot);

        // Nút mũi tên trái
        const leftButton = document.createElement('button');
        leftButton.className = 'arrow-button arrow-left';
        leftButton.innerHTML = '&#8249;';
        leftButton.style.position = 'absolute';
        leftButton.style.top = '50%';
        leftButton.style.transform = 'translateY(-50%)';
        leftButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        leftButton.style.color = 'white';
        leftButton.style.border = 'none';
        leftButton.style.padding = '10px';
        leftButton.style.cursor = 'pointer';
        leftButton.style.display = 'none';
        leftButton.style.zIndex = '1';
        leftButton.style.left = '0';
        leftButton.onclick = () => this.scrollLeft();

        // Nút mũi tên phải
        const rightButton = document.createElement('button');
        rightButton.className = 'arrow-button arrow-right';
        rightButton.innerHTML = '&#8250;';
        rightButton.style.position = 'absolute';
        rightButton.style.top = '50%';
        rightButton.style.transform = 'translateY(-50%)';
        rightButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        rightButton.style.color = 'white';
        rightButton.style.border = 'none';
        rightButton.style.padding = '10px';
        rightButton.style.cursor = 'pointer';
        rightButton.style.display = 'none';
        rightButton.style.zIndex = '1';
        rightButton.style.right = '0';
        rightButton.onclick = () => this.scrollRight();

        // Thêm các phần tử vào panel cuộn
        scrollPanel.appendChild(imageContainer);
        scrollPanel.appendChild(leftButton);
        scrollPanel.appendChild(rightButton);

        const style = document.createElement('style');
        style.textContent = `
:host{display: block;width:fit-content;max-width:100%;overflow-x:auto;}
.image-container::-webkit-scrollbar{height:var(--scroll-bar-height);}
.image-container::-webkit-scrollbar-track{background:var(--scroll-bar-track-bg);border-radius:var(--scroll-bar-track-border-rad);margin:var(--scroll-bar-margin);}
.image-container::-webkit-scrollbar-thumb{background:var(--scroll-bar-thumb-bg);border-radius:var(--scroll-bar-thumb-border-rad);}
.image-container::-webkit-scrollbar-thumb:hover{background: #555;}`
        // Thêm panel cuộn vào shadow DOM
        shadowRoot.append(style, scrollPanel);

        // Sự kiện kéo để cuộn
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollPanel.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollPanel.classList.add('active');
            startX = e.pageX - imageContainer.offsetLeft;
            scrollLeft = imageContainer.scrollLeft;
            imageContainer.style.pointerEvents = 'none';
        });

        scrollPanel.addEventListener('mouseleave', () => {
            isDown = false;
            scrollPanel.classList.remove('active');
            imageContainer.style.pointerEvents = 'all';
        });

        scrollPanel.addEventListener('mouseup', () => {
            isDown = false;
            scrollPanel.classList.remove('active');
            imageContainer.style.pointerEvents = 'all';
        });

        scrollPanel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - imageContainer.offsetLeft;
            const walk = (x - startX) * 2;
            imageContainer.scrollLeft = scrollLeft - walk;
        });

        // Cuộn bằng chuột


        scrollPanel.addEventListener('wheel', (e) => {
            const isDisableWheelScrollProp = getComputedStyle(this).getPropertyValue('--disable-wheel-scroll').trim();
            const isDisableWheelScroll = parseInt(isDisableWheelScrollProp);
            const scrollVelocity = getComputedStyle(this).getPropertyValue('--wheel-scroll-velocity').trim();
            const velocity = parseFloat(scrollVelocity);
            if (isDisableWheelScroll == 0) {
                e.preventDefault();
                imageContainer.scrollLeft += e.deltaY * velocity;
            }
        });

        // Hiển thị nút khi hover vào scrollPanel
        scrollPanel.addEventListener('mouseover', () => {
            imageContainer.style.overflowX = 'auto';
            if (imageContainer.scrollWidth > imageContainer.clientWidth) {
                leftButton.style.display = 'block';
                rightButton.style.display = 'block';
                scrollPanel.style.marginBottom = '0px';
            }
        });

        scrollPanel.addEventListener('mouseout', () => {
            imageContainer.style.overflowX = 'hidden';
            leftButton.style.display = 'none';
            rightButton.style.display = 'none';
            if (imageContainer.scrollWidth > imageContainer.clientWidth) {
                scrollPanel.style.marginBottom = 'var(--scroll-bar-height)';
            }
        });
    }

    scrollLeft() {
        const imageContainer = this.imageContainer;
        imageContainer.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    }

    scrollRight() {
        const imageContainer = this.imageContainer;
        imageContainer.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    }

}
customElements.define('hor-image-container', HorImageContainer);