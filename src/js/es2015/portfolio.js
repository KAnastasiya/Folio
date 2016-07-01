let portfolioReady = () => {
  /**
   * Class name of DOM-element
   * @type  {Object}
   */
  let portfolio = {
    img: 'portfolio-card__img',
    content: 'portfolio-content',
    pagination: 'portfolio-pagination',
    paginationItemList: 'js-portfolio-pagination__list',
    paginationItem: 'portfolio-pagination__item',
    paginationLink: 'portfolio-pagination__link',
    filtersList: 'portfolio-filters',
    filter: 'portfolio-filters__item',
    currentItem: 'is-active',
    showImage: 'visible'
  };

  /**
   * Supported types of filtering
   * @type  {Object}
   */
  let portfolioFilter = {
    all: 'all',
    wedding: 'wedding',
    landscape: 'landscape',
    portrait: 'portrait',
    events: 'events'
  };

  /**
   * DOM-elements for all portfolio images
   * @type  {HTMLCollection}
   */
  let portfolioImageList = document.querySelectorAll('.' + portfolio.img);

  /**
   * Name of the elements attribute, that contains elements
   * @type  {String}
   */
  let elementStateAttribute = 'data-state';

  /**
   * Name of the elements attribute, that contains filters name
   * @type  {String}
   */
  let elementFiltersNameAttribute = 'data-name';

  /**
   * Default filter
   * @type  {String}
   */
  const DEFAULT_FILTER = portfolioFilter.portrait;

  /**
   * Number of images on one page
   * @type  {Number}
   * @constant
   */
  const PAGE_SIZE = 9;

  /**
   * Default chosen page
   * @type  {Number}
   * @constant
   */
  const DEFAULT_PAGE_NUM = 0;

  /**
   * Name of record with last chosen filter in Local Storage
   * @type  {String}
   */
  let filterInStorage = 'filter';

  /**
   * Total number of portfolio images
   * @type  {Number}
   */
  let portfolioImageCount = portfolioImageList.length;

  /**
   * Number of portfolio pages
   * @type  {Number}
   */
  let portfolioPage = portfolioImageCount / PAGE_SIZE;

  /**
   * Render portfolio page
   * @param   {Number}  pageNum  Page number
   */
  let _renderPortfolioPage = (pageNum) => {
    let from = pageNum * PAGE_SIZE,
        to = from + PAGE_SIZE;
    for(let i = 0; i < portfolioImageCount; i++) {
      portfolioImageList[i].parentElement.classList.remove(portfolio.showImage);
    }
    for(let i = from; i < to && i < portfolioImageCount; i++) {
      portfolioImageList[i].parentElement.classList.add(portfolio.showImage);
    }
  };

  /**
   * Set portfolio pagination
   */
  let _setPortfolioPagination = () => {
    let portfolioPagination = document.createElement('div');
    portfolioPagination.className = portfolio.pagination;
    document.querySelector('.' + portfolio.content).appendChild(portfolioPagination);

    let portfolioPaginationList = document.createElement('ul');
    portfolioPaginationList.className = portfolio.paginationItemList;
    portfolioPagination.appendChild(portfolioPaginationList);

    for(let i = 0; i < portfolioPage; i++) {
      let portfolioPaginationItem = document.createElement('li');
      portfolioPaginationItem.className = portfolio.paginationItem;
      portfolioPaginationList.appendChild(portfolioPaginationItem);

      let portfolioPaginationNum = document.createElement('a');
      portfolioPaginationNum.className = portfolio.paginationLink;
      portfolioPaginationNum.innerHTML = i + 1;
      portfolioPaginationItem.appendChild(portfolioPaginationNum);
    }

    // Set first page as default page
    let portfolioPagesList = document.querySelectorAll('.' + portfolio.paginationItem);
    portfolioPagesList[0].children[0].setAttribute(elementStateAttribute, portfolio.currentItem);
  };

  /**
   * Save last chosen filter in Local Storage
   * @param  {Element}  slide  DOM-element, that contains filter
  */
  let _setFilterInStorage = () => {
    localStorage.setItem(filterInStorage, DEFAULT_FILTER);
  };

  /**
    * Get last chosen filter from Local Storage
    */
  let _getFilterFromStorage = () => {
    return localStorage.getItem(filterInStorage);
  };

  /**
   * Clicking on the pagination handler
   * @param {Object} event
   */
  let _onPortfolioPaginationClick = (event) => {
    let clickedPortfolioPage = event.target,
        clickedPortfolioPageParent = clickedPortfolioPage.parentElement;

    if (clickedPortfolioPageParent.classList.contains(portfolio.paginationItem)) {
      let portfolioPagesList = document.querySelectorAll('.' + portfolio.paginationItem);
      for(let i = 0; i < portfolioPagesList.length; i++) {
        portfolioPagesList[i].children[0].removeAttribute(elementStateAttribute);
      }
      clickedPortfolioPage.setAttribute(elementStateAttribute, portfolio.currentItem);
      _renderPortfolioPage(clickedPortfolioPage.innerHTML - 1);
    }
  };

  /**
   * Clicking on the filter handler
   * @param {Object} event
   */
  let _onPortfolioFilterClick = (event) => {
    let clickedFilterParent = event.target.parentElement,
        portfolioFiltersList = document.querySelectorAll('.' + portfolio.filter);
    if (clickedFilterParent.classList.contains(portfolio.filter)) {
      for(let i = 0; i < portfolioFiltersList.length; i++) {
        console.log(portfolioFiltersList[i].children[0]);
        portfolioFiltersList[i].children[0].removeAttribute(elementStateAttribute);
      }
      clickedFilterParent.children[0].setAttribute(elementStateAttribute, portfolio.currentItem);
      localStorage[filterInStorage] = clickedFilterParent.getAttribute(elementFiltersNameAttribute);
      // _filterPortfolioList(clickedFilter);
    }
  };

  /**
   * Initialization
   */
  (function _init() {
    let portfolioFiltersList = document.querySelectorAll('.' + portfolio.filter);

    _renderPortfolioPage(DEFAULT_PAGE_NUM);
    _setPortfolioPagination();

    // Set default chosen filter
    let defaultCurrentFilterName,
        defaultCurrentFilter;

    if (localStorage.hasOwnProperty(filterInStorage)) {
      defaultCurrentFilterName = _getFilterFromStorage();
    } else {
      defaultCurrentFilterName = DEFAULT_FILTER;
      _setFilterInStorage();
    }

    for(let i = 0; i < portfolioFiltersList.length; i++) {
      if(portfolioFiltersList[i].getAttribute(elementFiltersNameAttribute) === defaultCurrentFilterName) {
        defaultCurrentFilter = portfolioFiltersList[i];
      }
    }

    defaultCurrentFilter.children[0].setAttribute(elementStateAttribute, portfolio.currentItem);

    // Attaching event handlers
    document.querySelector('.' + portfolio.paginationItemList).addEventListener('click', _onPortfolioPaginationClick);
    document.querySelector('.' + portfolio.filtersList).addEventListener('click', _onPortfolioFilterClick);
  })();
};

document.addEventListener('DOMContentLoaded', portfolioReady);
