
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }
// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
     selectItems[i].addEventListener("click", function () {

          let selectedValue = this.innerText.toLowerCase();
          selectValue.innerText = this.innerText;
          elementToggleFunc(select);
          filterFunc(selectedValue);

     });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

     for (let i = 0; i < filterItems.length; i++) {

          if (selectedValue === "all") {
               filterItems[i].classList.add("active");
          } else if (selectedValue === filterItems[i].dataset.category) {
               filterItems[i].classList.add("active");
          } else {
               filterItems[i].classList.remove("active");
          }

     }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

     filterBtn[i].addEventListener("click", function () {

          let selectedValue = this.innerText.toLowerCase();
          selectValue.innerText = this.innerText;
          filterFunc(selectedValue);

          lastClickedBtn.classList.remove("active");
          this.classList.add("active");
          lastClickedBtn = this;

     });

}









//#################################################
const TRD_CONTRACT = window.TRD_CONTRACT;

const portfolioOverviewArea = document.getElementById('portfolio-overview-area');
const projectList = document.getElementById('portfolio-list');
const portfolioPageTitle = document.getElementById('portfolio-page-title');
const portfolioCloseBtn = document.getElementById('portfolio-close-btn');
const portfolioPageDetail = document.getElementById('portfolio-page-detai');
const portfolioList = document.getElementById('portfolio-list');
const portfolioIframeContainer = document.getElementById('portfolio-page-iframe-container');

window.addEventListener('message', function (event) {
     const data = event.data;
     switch (data.event) {
          case TRD_CONTRACT.EVENT.IFRAME_CONTENT_SIZE_CHANGED:
               if (data.frameId) {
                    if (event.data.height) {
                         portfolioIframeContainer.style.height = event.data.height + 'px';
                    }
               }
               break;
          default:
               console.log('Unknown event:', data.event);
     }
});

portfolioCloseBtn.addEventListener('click', function () {
     portfolioOverviewArea.classList.add('active')
     portfolioPageDetail.classList.remove('active')
     portfolioIframeContainer.setAttribute('src', '')
})

async function fetchProjects() {
     try {
          const response = await fetch('data/portfolios.json');
          const projects = await response.json();
          return projects;
     } catch (error) {
          console.error('Error fetching projects:', error);
     }
}

function projectItemClickCallback(project) {
     portfolioOverviewArea.classList.remove('active')
     portfolioPageDetail.classList.add('active')
     portfolioPageTitle.innerText = project.page_name
     portfolioIframeContainer.setAttribute('src', project.page_url + '?iframeId=portfolioIframeContainer')
}

// Hàm tạo các phần tử HTML từ dữ liệu JSON
const templatePortfolioListItem = document.getElementById('portfolio-list-item');
function createProjectList(projects) {
     projects.forEach(project => {
          const listItem = templatePortfolioListItem.cloneNode(true);

          listItem.classList.add('active');
          listItem.setAttribute('data-filter-item', '');
          listItem.setAttribute('data-category', project.page_category);

          const img = listItem.querySelector("[portfolio-list-item-img]");
          img.src = project.page_avatar;
          img.alt = project.page_name;
          img.loading = 'lazy';

          const title = listItem.querySelector("[portfolio-list-item-title]");
          title.textContent = project.page_name;

          const category = listItem.querySelector("[portfolio-list-item-category]");
          category.textContent = project.page_category;

          listItem.addEventListener('click', function () {
               projectItemClickCallback(project)
          })
          projectList.appendChild(listItem);
     });
}

// Khởi tạo dữ liệu
async function init() {
     const projects = await fetchProjects();
     if (projects) {
          createProjectList(projects);
     }
}

// Gọi hàm khởi tạo

window.addEventListener('load', function () {
     // init();
})

init()