'use strict';

var portfolioReady = function portfolioReady() {
  /**
   * Class name of DOM-element
   * @type  {Object}
   */
  var portfolio = {
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
  var portfolioFilter = {
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
  var portfolioImageList = document.querySelectorAll('.' + portfolio.img);

  /**
   * Name of the elements attribute, that contains elements
   * @type  {String}
   */
  var elementStateAttribute = 'data-state';

  /**
   * Name of the elements attribute, that contains filters name
   * @type  {String}
   */
  var elementFiltersNameAttribute = 'data-name';

  /**
   * Default filter
   * @type  {String}
   */
  var DEFAULT_FILTER = portfolioFilter.portrait;

  /**
   * Number of images on one page
   * @type  {Number}
   * @constant
   */
  var PAGE_SIZE = 9;

  /**
   * Default chosen page
   * @type  {Number}
   * @constant
   */
  var DEFAULT_PAGE_NUM = 0;

  /**
   * Name of record with last chosen filter in Local Storage
   * @type  {String}
   */
  var filterInStorage = 'filter';

  /**
   * Total number of portfolio images
   * @type  {Number}
   */
  var portfolioImageCount = portfolioImageList.length;

  /**
   * Number of portfolio pages
   * @type  {Number}
   */
  var portfolioPage = portfolioImageCount / PAGE_SIZE;

  /**
   * Render portfolio page
   * @param   {Number}  pageNum  Page number
   */
  var _renderPortfolioPage = function _renderPortfolioPage(pageNum) {
    var from = pageNum * PAGE_SIZE,
        to = from + PAGE_SIZE;
    for (var i = 0; i < portfolioImageCount; i++) {
      portfolioImageList[i].parentElement.classList.remove(portfolio.showImage);
    }
    for (var _i = from; _i < to && _i < portfolioImageCount; _i++) {
      portfolioImageList[_i].parentElement.classList.add(portfolio.showImage);
    }
  };

  /**
   * Set portfolio pagination
   */
  var _setPortfolioPagination = function _setPortfolioPagination() {
    var portfolioPagination = document.createElement('div');
    portfolioPagination.className = portfolio.pagination;
    document.querySelector('.' + portfolio.content).appendChild(portfolioPagination);

    var portfolioPaginationList = document.createElement('ul');
    portfolioPaginationList.className = portfolio.paginationItemList;
    portfolioPagination.appendChild(portfolioPaginationList);

    for (var i = 0; i < portfolioPage; i++) {
      var portfolioPaginationItem = document.createElement('li');
      portfolioPaginationItem.className = portfolio.paginationItem;
      portfolioPaginationList.appendChild(portfolioPaginationItem);

      var portfolioPaginationNum = document.createElement('a');
      portfolioPaginationNum.className = portfolio.paginationLink;
      portfolioPaginationNum.innerHTML = i + 1;
      portfolioPaginationItem.appendChild(portfolioPaginationNum);
    }

    // Set first page as default page
    var portfolioPagesList = document.querySelectorAll('.' + portfolio.paginationItem);
    portfolioPagesList[0].children[0].setAttribute(elementStateAttribute, portfolio.currentItem);
  };

  /**
   * Save last chosen filter in Local Storage
   * @param  {Element}  slide  DOM-element, that contains filter
  */
  var _setFilterInStorage = function _setFilterInStorage() {
    localStorage.setItem(filterInStorage, DEFAULT_FILTER);
  };

  /**
    * Get last chosen filter from Local Storage
    */
  var _getFilterFromStorage = function _getFilterFromStorage() {
    return localStorage.getItem(filterInStorage);
  };

  /**
   * Clicking on the pagination handler
   * @param {Object} event
   */
  var _onPortfolioPaginationClick = function _onPortfolioPaginationClick(event) {
    var clickedPortfolioPage = event.target,
        clickedPortfolioPageParent = clickedPortfolioPage.parentElement;

    if (clickedPortfolioPageParent.classList.contains(portfolio.paginationItem)) {
      var portfolioPagesList = document.querySelectorAll('.' + portfolio.paginationItem);
      for (var i = 0; i < portfolioPagesList.length; i++) {
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
  var _onPortfolioFilterClick = function _onPortfolioFilterClick(event) {
    var clickedFilterParent = event.target.parentElement,
        portfolioFiltersList = document.querySelectorAll('.' + portfolio.filter);
    if (clickedFilterParent.classList.contains(portfolio.filter)) {
      for (var i = 0; i < portfolioFiltersList.length; i++) {
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
    var portfolioFiltersList = document.querySelectorAll('.' + portfolio.filter);

    _renderPortfolioPage(DEFAULT_PAGE_NUM);
    _setPortfolioPagination();

    // Set default chosen filter
    var defaultCurrentFilterName = void 0,
        defaultCurrentFilter = void 0;

    if (localStorage.hasOwnProperty(filterInStorage)) {
      defaultCurrentFilterName = _getFilterFromStorage();
    } else {
      defaultCurrentFilterName = DEFAULT_FILTER;
      _setFilterInStorage();
    }

    for (var i = 0; i < portfolioFiltersList.length; i++) {
      if (portfolioFiltersList[i].getAttribute(elementFiltersNameAttribute) === defaultCurrentFilterName) {
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