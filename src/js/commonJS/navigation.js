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