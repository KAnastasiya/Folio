/**
 * Class name of DOM-element
 * @type {Object}
 */
const portfolio = {
  portfolio: 'portfolio',
  img: 'portfolio__item-img',
  filtersList: 'portfolio-filters__list',
  filter: 'portfolio-filters__item',
  pagination: 'portfolio-pagination',
  paginationItemList: 'portfolio-pagination__list',
  paginationItem: 'portfolio-pagination__item',
  paginationLink: 'portfolio-pagination__link',
  currentItem: 'is-active',
  showImage: 'visible',
};

/**
 * Supported types of filtering
 * @type {Object}
 */
const portfolioFilter = {
  all: 'All',
  wedding: 'Wedding',
  landscape: 'Landscape',
  portrait: 'Portrait',
  events: 'Events',
};

/**
 * DOM-elements for all portfolio images
 * @type {HTMLCollection}
 */
const portfolioImageList = document.querySelectorAll(`.${portfolio.img}`);

/**
 * Name of the elements attribute, that contains elements
 * @type {String}
 */
const elementStateAttribute = 'data-state';

/**
 * Name of the elements attribute, that contains filters name
 * @type {String}
 */
const elementFiltersNameAttribute = 'data-name';

/**
 * Default filter
 * @type {String}
 */
const DEFAULT_FILTER = portfolioFilter.portrait;

/**
 * Number of images on one page
 * @type {Number}
 * @constant
 */
const PAGE_SIZE = 9;

/**
 * Default chosen page
 * @type {Number}
 * @constant
 */
const DEFAULT_PAGE_NUM = 0;

/**
 * Name of record with last chosen filter in Local Storage
 * @type {String}
 */
const filterInStorage = 'filter';

/**
 * Total number of portfolio images
 * @type {Number}
 */
const portfolioImageCount = portfolioImageList.length;

/**
 * Number of portfolio pages
 * @type {Number}
 */
const portfolioPage = portfolioImageCount / PAGE_SIZE;

/**
 * Render portfolio page
 * @param {Number}  pageNum  Page number
 */
const renderPortfolioPage = (pageNum) => {
  const from = pageNum * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  for (let i = 0; i < portfolioImageCount; i++) {
    portfolioImageList[i].parentElement.classList.remove(portfolio.showImage);
  }

  for (let i = from; i < to && i < portfolioImageCount; i++) {
    portfolioImageList[i].parentElement.classList.add(portfolio.showImage);
  }
};

/**
 * Set portfolio pagination
 */
const setPortfolioPagination = () => {
  const portfolioPagination = document.createElement('div');
  portfolioPagination.className = portfolio.pagination;
  document.querySelector(`.${portfolio.portfolio}`).appendChild(portfolioPagination);

  const portfolioPaginationList = document.createElement('ul');
  portfolioPaginationList.className = portfolio.paginationItemList;
  portfolioPagination.appendChild(portfolioPaginationList);

  for (let i = 0; i < portfolioPage; i++) {
    const portfolioPaginationItem = document.createElement('li');
    portfolioPaginationItem.className = portfolio.paginationItem;
    portfolioPaginationList.appendChild(portfolioPaginationItem);

    const portfolioPaginationNum = document.createElement('a');
    portfolioPaginationNum.className = portfolio.paginationLink;
    portfolioPaginationNum.innerHTML = i + 1;
    portfolioPaginationItem.appendChild(portfolioPaginationNum);
  }

  // Set first page as default page
  const portfolioPagesList = document.querySelectorAll(`.${portfolio.paginationItem}`);
  portfolioPagesList[0].children[0].setAttribute(elementStateAttribute, portfolio.currentItem);
};

/**
 * Save last chosen filter in Local Storage
 * @param {Element}  slide  DOM-element, that contains filter
*/
const setFilterInStorage = () => {
  localStorage.setItem(filterInStorage, DEFAULT_FILTER);
};

/**
  * Get last chosen filter from Local Storage
  */
const getFilterFromStorage = () => localStorage.getItem(filterInStorage);

/**
 * Clicking on the pagination handler
 * @param {Object} event
 */
const onPortfolioPaginationClick = (event) => {
  const clickedPortfolioPage = event.target;
  const clickedPortfolioPageParent = clickedPortfolioPage.parentElement;

  if (clickedPortfolioPageParent.classList.contains(portfolio.paginationItem)) {
    const portfolioPagesList = document.querySelectorAll(`.${portfolio.paginationItem}`);
    for (let i = 0; i < portfolioPagesList.length; i++) {
      portfolioPagesList[i].children[0].removeAttribute(elementStateAttribute);
    }
    clickedPortfolioPage.setAttribute(elementStateAttribute, portfolio.currentItem);
    renderPortfolioPage(clickedPortfolioPage.innerHTML - 1);
  }
};

/**
 * Clicking on the filter handler
 * @param {Object} event
 */
const onPortfolioFilterClick = (event) => {
  const clickedFilterParent = event.target.parentElement;
  const portfolioFiltersList = document.querySelectorAll(`.${portfolio.filter}`);

  if (clickedFilterParent.classList.contains(portfolio.filter)) {
    for (let i = 0; i < portfolioFiltersList.length; i++) {
      portfolioFiltersList[i].children[0].removeAttribute(elementStateAttribute);
    }
    clickedFilterParent.children[0].setAttribute(elementStateAttribute, portfolio.currentItem);
    localStorage[filterInStorage] = clickedFilterParent.getAttribute(elementFiltersNameAttribute);
  }
};

/**
 * Initialization
 */
(function init() {
  const portfolioFiltersList = document.querySelectorAll(`.${portfolio.filter}`);

  if (portfolioFiltersList.length) {
    renderPortfolioPage(DEFAULT_PAGE_NUM);
    setPortfolioPagination();

    let defaultCurrentFilterName;
    let defaultCurrentFilter;

    if ({}.propertyIsEnumerable.call(localStorage, filterInStorage)) {
      defaultCurrentFilterName = getFilterFromStorage();
    } else {
      defaultCurrentFilterName = DEFAULT_FILTER;
      setFilterInStorage();
    }

    for (let i = 0; i < portfolioFiltersList.length; i++) {
      if (portfolioFiltersList[i].getAttribute(elementFiltersNameAttribute).toUpperCase() === defaultCurrentFilterName.toUpperCase()) {
        defaultCurrentFilter = portfolioFiltersList[i];
      }
    }

    defaultCurrentFilter.children[0].setAttribute(elementStateAttribute, portfolio.currentItem);

    document.querySelector(`.${portfolio.paginationItemList}`).addEventListener('click', onPortfolioPaginationClick);
    document.querySelector(`.${portfolio.filtersList}`).addEventListener('click', onPortfolioFilterClick);
  }
}());
