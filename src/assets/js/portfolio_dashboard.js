//#################################################
const TRD_CONTRACT = window.TRD_CONTRACT;

const portfolioOverviewArea = document.getElementById('portfolio-overview-area');
const projectList = document.getElementById('portfolio-list');
const portfolioPageTitle = document.getElementById('portfolio-page-title');
const portfolioCloseBtn = document.getElementById('portfolio-close-btn');
const portfolioPageDetail = document.getElementById('portfolio-page-detai');
const portfolioList = document.getElementById('portfolio-list');
const portfolioIframeContainer = document.getElementById('portfolio-page-iframe-container');

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
          listItem.setAttribute('data-category', project.page_category.toLowerCase());

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
     projectList.removeChild(templatePortfolioListItem);
     filterItems = document.querySelectorAll("[data-filter-item]");
}

// Khởi tạo dữ liệu
async function init() {
     const projects = await fetchProjects();
     if (projects) {
          createProjectList(projects);
          createFilterList(projects);
     }
}

const categoryFilterList = document.getElementById('category-filter-list')
const categoryFilterListItem = document.getElementById('category-filter-list-item')
const categorySelectList = document.getElementById('category-select-list')
const categorySelectListItem = document.getElementById('category-select-list-item')
const selectValue = document.querySelector("[data-selecct-value]");
const select = document.querySelector("[data-select]");
let filterItems;
let lastClickedBtn = categoryFilterListItem.querySelector("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }
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
const filterBtnClickFunc = function () {
     let selectedValue = this.innerText.toLowerCase();
     selectValue.innerText = this.innerText;
     filterFunc(selectedValue);

     lastClickedBtn.classList.remove("active");
     this.classList.add("active");
     lastClickedBtn = this;
}
const selectBtnClickFunc = function () {
     let selectedValue = this.innerText.toLowerCase();
     selectValue.innerText = this.innerText;
     elementToggleFunc(select);
     filterFunc(selectedValue);
}

function createFilterList(projects) {
     const filterAllBtn = categoryFilterListItem.querySelector("[data-filter-btn]");
     filterAllBtn.addEventListener('click', filterBtnClickFunc)

     const selectAllBtn = categorySelectListItem.querySelector("[data-select-item]");
     selectAllBtn.addEventListener('click', selectBtnClickFunc)

     const categories = new Set();
     projects.forEach(project => {
          categories.add(project.page_category);
     });
     categories.forEach(category => {
          const cloneCategoryFilterListItem = categoryFilterListItem.cloneNode(true);
          const btn = cloneCategoryFilterListItem.querySelector("[data-filter-btn]");
          btn.innerText = category;
          btn.addEventListener('click', filterBtnClickFunc)
          categoryFilterList.appendChild(cloneCategoryFilterListItem);

          const cloneCategorySelectListItem = categorySelectListItem.cloneNode(true);
          const btn2 = cloneCategorySelectListItem.querySelector("[data-select-item]");
          btn2.innerText = category;
          btn2.addEventListener('click', selectBtnClickFunc)
          categorySelectList.appendChild(cloneCategorySelectListItem);
     });
     filterAllBtn.classList.add('active')
     filterFunc('all');
}

init()