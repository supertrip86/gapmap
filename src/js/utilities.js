module.exports = {

  // add event listener to dynamically created DOM element
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

  lock: () => {

  },

  get: {
    // get trimmed value from target DOM input
    getValue: (target) => {
      return document.querySelectorAll(target)[0].value.trim();
    },

    // get innerText from target DOM element
    getText: (target) => {
      return document.querySelectorAll(target)[0].innerText;
    },

    // get HTML content from target DOM element
    getHTML: (target) => {
      return document.querySelectorAll(target)[0].innerHTML;
    },

    // get date from datepicker and convert it to ISO 8601, SharePoint compatible
    getDate: (target) => {
      const value = document.querySelectorAll(target)[0].value.trim();

      return new Date(value).toISOString();
    },
  },

  check: {
    // check filename for invalid extension
    isFileInvalid: (filename) => {
      const validExtensions = ["xls", "xlsx", "doc", "docx", "ppt", "pptx", "pdf"];
      const extension = filename.split('.').pop();

      return validExtensions.indexOf(extension) == -1;
    },

    // check for invalid characters in filename
    isFilenameInvalid: (filename) => {
      const charList = ['~', '#', '%', '&' , '*', '{', '}', '\\', ':', '<', '>', '?', '/', '|', '"', "'"];

      return filename.split("").some(ch => charList.indexOf(ch) !== -1);
    },

    // check that filesize does not exceed the maximum amount of 20 MegaBytes
    isFilesizeExceeded: (size) => {
      const convertedValue = size / 1000000;

      return convertedValue > 20;
    },
  },

  options: {
    // parameters for SelectPure instance in settings menu
    selectOptions: (list, placeholder, auto, value) => {
      return {
        options: list,
        placeholder: placeholder,
        autocomplete: auto,
        value: value
      };
    },

    // parameters for @chenfengyuan/datepicker instance in settings menu
    createDatePickerOptions: (format, autoHide) => {
      return {
        zIndex: 1100,
        format: format,
        autoHide: autoHide
      };
    },

    // parameters for QuillJS instance in settings menu
    createEditorOptions: () => {
      return {
        modules: {
          'toolbar': [
            [ 'bold', 'italic', 'underline' ],
            [{ 'color': [] }, { 'background': [] }, { 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            [ 'link']
          ],
          counter: {
            container: '#counter',
            unit: 'character'
          }
        },
        placeholder: 'Insert a description',
        theme: 'snow'
      };
    }
  }
  
};