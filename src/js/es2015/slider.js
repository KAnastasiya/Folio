let sliderReady = () => {
  /**
   * Class name of DOM-element
   * @type  {Object}
   */
  let slider = {
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
  let slideList = document.querySelectorAll('.' + slider.item);

  /**
   * Name of the elements attribute, that contains elements
   * @type  {String}
   */
  let elementStateAttribute = 'data-state';

  /**
   * Name of the elements attribute, that contains number of slide
   * @type  {String}
   */
  let elementSlideNumAttribute = 'data-num';

  /**
   * Default chosen slide
   * @type  {Number}
   * @constant
   */
  const DEFAULT_SLIDE = 0;

  /**
   * Name of record with last chosen slide in Local Storage
   * @type  {String}
   */
  let slideInStorage = 'slide';

  /**
   * Render page background
   */
  let _setPageBackground = (element) => {
    document.querySelector('.page-bg').style.backgroundImage = 'url(' + element.getAttribute('data-img') + ')';
  };

  /**
   * Render slider counter
   * @param  {Element}  currentSLide  Current chosen slide
   */
  let _renderSlideCounter = (currentSLide) => {
    // Create DOM-element for slide counter container
    let slideCounter = document.createElement('p');
    slideCounter.className = slider.itemCounter;
    slideCounter.innerHTML = '||';

    // Create DOM-element for slide counter
    let slideCounterContent = document.createElement('span');
    slideCounterContent.className = slider.itemCounterValue;

    // Insert slide counter and its container in DOM
    let sliderContainer = document.querySelector('.' + slider.container);
    sliderContainer.insertBefore(slideCounter, sliderContainer.children[0]);
    sliderContainer.children[0].appendChild(slideCounterContent);

    _setSlideCounter(currentSLide, slideCounterContent);
  };

  /**
   * Set slider counter value
   * @param  {Element}  slide  DOM-element, that contains slide
   * @param  {Element}  counterContainer  DOM-element, that contains slider counter value
  */
  let _setSlideCounter = (slide, counterContainer) => {
    counterContainer.innerHTML = slide.getAttribute(elementSlideNumAttribute) + ' / ' + slideList.length;
  };

  /**
   * Change current slide
   * @param  {Element}  slideParent  DOM-element, that is current slide parent
   */
  let _changeCurrentSlide = (slideParent) => {
    let slidesList = document.querySelectorAll('.' + slider.item);
    for(let i = 0; i < slidesList.length; i++) {
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
  let _setSlideInStorage = () => {
    localStorage.setItem(slideInStorage, DEFAULT_SLIDE);
  };

  /**
    * Get last chosen slide from Local Storage
    */
  let _getSlideFromStorage = () => {
    return localStorage.getItem(slideInStorage);
  };

  /**
   * Clicking on the slide handler
   * @param  {Object}  event
   */
  let _onSlideClick = (event) => {
    let clickedSlideParent = event.target.parentElement;
    if (clickedSlideParent.classList.contains(slider.item)) {
      _changeCurrentSlide(clickedSlideParent);
    }
  };

  /**
   * Initialization
   */
  (function _initFunc() {
    let slideContainer = document.querySelector('.' + slider.itemList),
        defaultCurrentSlide;

    // Set default chosen slide
    if (localStorage.hasOwnProperty(slideInStorage)) {
      let defaultCurrentSlideNum = _getSlideFromStorage();
      for(let i = 0; i < slideList.length; i++) {
        if( (slideList[i].getAttribute(elementSlideNumAttribute) - 1) === +defaultCurrentSlideNum ) {
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
