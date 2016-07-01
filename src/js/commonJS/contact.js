'use strict';

var contactFormReady = function contactFormReady() {
  /**
   * Class name of DOM-element
   * @type  {Object}
   */
  var contact = {
    form: 'js-contact-form',
    firstName: 'js-user-first-name',
    lastName: 'js-user-last-name',
    email: 'js-user-email',
    message: 'js-user-message',
    send: 'js-send-message'
  };

  /**
   * Change state of button "Send"
   */
  var changeSendBtnState = function changeSendBtnState() {
    var userFirstName = document.querySelector('.' + contact.firstName),
        userLastName = document.querySelector('.' + contact.lastName),
        userEmail = document.querySelector('.' + contact.email),
        message = document.querySelector('.' + contact.message),
        sendBtn = document.querySelector('.' + contact.send);

    if (userFirstName.value && userLastName.value && userEmail.value && message.value) {
      sendBtn.setAttribute('disabled', 'false');
    } else {
      sendBtn.setAttribute('disabled', 'disabled');
    }
  };

  /**
   * Changing fields value handler
   */
  var _onChangeFieldValue = function _onChangeFieldValue() {
    changeSendBtnState();
  };

  /**
   * Initialization
   */
  (function _init() {
    changeSendBtnState();
  })();

  // Attaching event handlers
  document.querySelector('.' + contact.form).addEventListener('input', _onChangeFieldValue);
};

document.addEventListener('DOMContentLoaded', contactFormReady);