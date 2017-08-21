/**
 * Class name of DOM-element
 * @type  {Object}
 */
const slider = {
  container: 'slider',
  itemList: 'slider__list',
  item: 'slider__item',
  itemCounter: 'slider__counter',
  itemCounterValue: 'slider__counter-value',
  currentItem: 'is-active',
};

/**
 * DOM-elements, that contains slide
 * @type  {HTMLCollection}
 */
const slideList = document.querySelectorAll(`.${slider.item}`);

/**
 * Name of the elements attribute, that contains elements
 * @type  {String}
 */
const elementStateAttribute = 'data-state';

/**
 * Name of the elements attribute, that contains number of slide
 * @type  {String}
 */
const elementSlideNumAttribute = 'data-num';

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
const slideInStorage = 'slide';

/**
 * Render page background
 */
const setPageBackground = (element) => {
  document.querySelector('body').style.backgroundImage = `url(${element.getAttribute('data-img')})`;
};

  /**
 * Set slider counter value
 * @param  {Element}  slide  DOM-element, that contains slide
 * @param  {Element}  counterContainer  DOM-element, that contains slider counter value
*/
const setSlideCounter = (slide, counterContainer) => {
  const container = counterContainer;
  container.innerHTML = `${slide.getAttribute(elementSlideNumAttribute)} / ${slideList.length}`;
};

/**
 * Render slider counter
 * @param  {Element}  currentSLide  Current chosen slide
 */
const renderSlideCounter = (currentSLide) => {
  // Create DOM-element for slide counter container
  const slideCounter = document.createElement('p');
  slideCounter.className = slider.itemCounter;
  slideCounter.innerHTML = '||';

  // Create DOM-element for slide counter
  const slideCounterContent = document.createElement('span');
  slideCounterContent.className = slider.itemCounterValue;

  // Insert slide counter and its container in DOM
  const sliderContainer = document.querySelector(`.${slider.container}`);
  sliderContainer.insertBefore(slideCounter, sliderContainer.children[0]);
  sliderContainer.children[0].appendChild(slideCounterContent);

  setSlideCounter(currentSLide, slideCounterContent);
};

/**
 * Change current slide
 * @param  {Element}  slideParent  DOM-element, that is current slide parent
 */
const changeCurrentSlide = (slide, slideParent) => {
  const slidesList = document.querySelectorAll(`.${slider.item}`);
  for (let i = 0; i < slidesList.length; i++) {
    slidesList[i].children[0].removeAttribute(elementStateAttribute);
  }
  slideParent.children[0].setAttribute(elementStateAttribute, slider.currentItem);
  localStorage[slideInStorage] = slideParent.getAttribute(elementSlideNumAttribute) - 1;
  setPageBackground(slide.parentElement);
  setSlideCounter(slideParent, document.querySelector(`.${slider.itemCounterValue}`));
};

/**
 * Save last chosen slide in Local Storage
 * @param  {Element}  slide  DOM-element, that contains slide
*/
const setSlideInStorage = () => localStorage.setItem(slideInStorage, DEFAULT_SLIDE);

/**
  * Get last chosen slide from Local Storage
  */
const getSlideFromStorage = () => localStorage.getItem(slideInStorage);

/**
 * Clicking on the slide handler
 * @param  {Object}  event
 */
const onSlideClick = (event) => {
  const clickedSlideParent = event.target.parentElement;
  if (clickedSlideParent.classList.contains(slider.item)) {
    changeCurrentSlide(event.target, clickedSlideParent);
  }
};

/**
 * Initialization
 */
(function _initFunc() {
  const slideContainer = document.querySelector(`.${slider.itemList}`);
  let defaultCurrentSlide;

  // Set default chosen slide
  if ({}.propertyIsEnumerable.call(localStorage, slideInStorage)) {
    const defaultCurrentSlideNum = getSlideFromStorage();
    for (let i = 0; i < slideList.length; i++) {
      if ((slideList[i].getAttribute(elementSlideNumAttribute) - 1) === +defaultCurrentSlideNum) {
        defaultCurrentSlide = slideList[i];
      }
    }
  } else {
    defaultCurrentSlide = slideContainer.children[DEFAULT_SLIDE];
    setSlideInStorage(DEFAULT_SLIDE);
  }

  defaultCurrentSlide.children[0].setAttribute(elementStateAttribute, slider.currentItem);

  // Set slider counter and default background
  setPageBackground(defaultCurrentSlide);
  renderSlideCounter(defaultCurrentSlide);

  // Attaching event handlers
  slideContainer.addEventListener('click', onSlideClick);
}());
