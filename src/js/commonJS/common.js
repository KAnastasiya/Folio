'use strict';

var sliderReady = function sliderReady() {
  /**
   * Class name of DOM-element
   * @type  {Object}
   */
  var slider = {
    container: 'slider',
    itemList: 'js-slides',
    item: 'slides__item',
    itemCounter: 'slides__counter',
    itemCounterValue: 'slides__counter-value',
    currentItem: 'is-active'
  };

  /**
   * DOM-elements, that contains slide
   * @type  {HTMLCollection}
   */
  var slideList = document.querySelectorAll('.' + slider.item);

  /**
   * Name of the elements attribute, that contains elements
   * @type  {String}
   */
  var elementStateAttribute = 'data-state';

  /**
   * Name of the elements attribute, that contains number of slide
   * @type  {String}
   */
  var elementSlideNumAttribute = 'data-num';

  /**
   * Default chosen slide
   * @type  {Number}
   * @constant
   */
  var DEFAULT_SLIDE = 0;

  /**
   * Name of record with last chosen slide in Local Storage
   * @type  {String}
   */
  var slideInStorage = 'slide';

  /**
   * Render page background
   */
  var _setPageBackground = function _setPageBackground(element) {
    document.querySelector('.page-bg').style.backgroundImage = 'url(' + element.getAttribute('data-img') + ')';
  };

  /**
   * Render slider counter
   * @param  {Element}  currentSLide  Current chosen slide
   */
  var _renderSlideCounter = function _renderSlideCounter(currentSLide) {
    // Create DOM-element for slide counter container
    var slideCounter = document.createElement('p');
    slideCounter.className = slider.itemCounter;
    slideCounter.innerHTML = '||';

    // Create DOM-element for slide counter
    var slideCounterContent = document.createElement('span');
    slideCounterContent.className = slider.itemCounterValue;

    // Insert slide counter and its container in DOM
    var sliderContainer = document.querySelector('.' + slider.container);
    sliderContainer.insertBefore(slideCounter, sliderContainer.children[0]);
    sliderContainer.children[0].appendChild(slideCounterContent);

    _setSlideCounter(currentSLide, slideCounterContent);
  };

  /**
   * Set slider counter value
   * @param  {Element}  slide  DOM-element, that contains slide
   * @param  {Element}  counterContainer  DOM-element, that contains slider counter value
  */
  var _setSlideCounter = function _setSlideCounter(slide, counterContainer) {
    counterContainer.innerHTML = slide.getAttribute(elementSlideNumAttribute) + ' / ' + slideList.length;
  };

  /**
   * Change current slide
   * @param  {Element}  slideParent  DOM-element, that is current slide parent
   */
  var _changeCurrentSlide = function _changeCurrentSlide(slideParent) {
    var slidesList = document.querySelectorAll('.' + slider.item);
    for (var i = 0; i < slidesList.length; i++) {
      slidesList[i].children[0].removeAttribute(elementStateAttribute);
    }
    slideParent.children[0].setAttribute(elementStateAttribute, slider.currentItem);
    localStorage[slideInStorage] = slideParent.getAttribute(elementSlideNumAttribute) - 1;
    _setPageBackground(event.target.parentElement);
    _setSlideCounter(slideParent, document.querySelector('.' + slider.itemCounterValue));
  };

  /**
   * Save last chosen slide in Local Storage
   * @param  {Element}  slide  DOM-element, that contains slide
  */
  var _setSlideInStorage = function _setSlideInStorage() {
    localStorage.setItem(slideInStorage, DEFAULT_SLIDE);
  };

  /**
    * Get last chosen slide from Local Storage
    */
  var _getSlideFromStorage = function _getSlideFromStorage() {
    return localStorage.getItem(slideInStorage);
  };

  /**
   * Clicking on the slide handler
   * @param  {Object}  event
   */
  var _onSlideClick = function _onSlideClick(event) {
    var clickedSlideParent = event.target.parentElement;
    if (clickedSlideParent.classList.contains(slider.item)) {
      _changeCurrentSlide(clickedSlideParent);
    }
  };

  /**
   * Initialization
   */
  (function _initFunc() {
    var slideContainer = document.querySelector('.' + slider.itemList),
        defaultCurrentSlide = void 0;

    // Set default chosen slide
    if (localStorage.hasOwnProperty(slideInStorage)) {
      var defaultCurrentSlideNum = _getSlideFromStorage();
      for (var i = 0; i < slideList.length; i++) {
        if (slideList[i].getAttribute(elementSlideNumAttribute) - 1 === +defaultCurrentSlideNum) {
          defaultCurrentSlide = slideList[i];
        }
      }
    } else {
      defaultCurrentSlide = slideContainer.children[DEFAULT_SLIDE];
      _setSlideInStorage(DEFAULT_SLIDE);
    }

    defaultCurrentSlide.children[0].setAttribute(elementStateAttribute, slider.currentItem);

    // Set slider counter and default background
    _setPageBackground(defaultCurrentSlide);
    _renderSlideCounter(defaultCurrentSlide);

    // Attaching event handlers
    slideContainer.addEventListener('click', _onSlideClick);
  })();
};

document.addEventListener('DOMContentLoaded', sliderReady);
'use strict';

var navReady = function navReady() {
  /**
   * Class name of DOM-element
   * @type  {Object}
   */
  var navigation = {
    itemList: 'js-page-nav',
    item: 'page-nav__item',
    currentItem: 'is-active'
  };

  /**
   * Name of the elements attribute, that contains elements
   * @type  {String}
   */
  var elementStateAttribute = 'data-state';

  /**
   * Clicking on the filter handler
   * @param {Object} event
   */
  var _onNavigationClick = function _onNavigationClick(event) {
    var clickedItem = event.target,
        clickedItemParent = event.target.parentElement;

    if (clickedItemParent.classList.contains(navigation.item)) {
      window.location.assign(clickedItem.getAttribute('href'));

      var itemList = document.querySelectorAll('.' + navigation.item);
      for (var i = 0; i < itemList.length; i++) {
        itemList[i].children[0].removeAttribute(elementStateAttribute);
      }
      clickedItemParent.children[0].setAttribute(elementStateAttribute, navigation.currentItem);
    }
  };

  /**
   * Initialization
   */
  (function _init() {
    // Set default chosen page of site
    var itemList = document.querySelectorAll('.' + navigation.item);
    for (var i = 0; i < itemList.length; i++) {
      if (window.location.pathname.slice(1) === itemList[i].children[0].getAttribute('href')) {
        itemList[i].children[0].setAttribute(elementStateAttribute, navigation.currentItem);
      } else if (window.location.pathname === '/') {
        itemList[0].children[0].setAttribute(elementStateAttribute, navigation.currentItem);
      }
    }

    // Attaching event handlers
    document.querySelector('.' + navigation.itemList).addEventListener('click', _onNavigationClick);
  })();
};

document.addEventListener('DOMContentLoaded', navReady);