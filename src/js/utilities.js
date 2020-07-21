module.exports = {

  on: (selector, eventType, childSelector, eventHandler) => {
    const elements = document.querySelectorAll(selector);
    for (element of elements) {
      element.addEventListener(eventType, eventOnElement => {
        if (eventOnElement.target.matches(childSelector)) {
          eventHandler(eventOnElement);
        }
      })
    }
  },

  getValue: (target) => {
    return document.querySelectorAll(target)[0].value.trim();
  },

  getText: (target) => {
    return document.querySelectorAll(target)[0].innerText;
  }

};