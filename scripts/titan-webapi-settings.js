
if (document.registerElement) {

  var proto = Object.create(HTMLElement .prototype, {

    createdCallback: {
      value:
      function() {
          this.updateDOM();
          this.addEventListener('click',this.click);
          this.style="cursor: pointer;text-align:center;vertical-align:middle"
      },
      enumerable: true
    },

    attachedCallback: {
      value:
      /**
       * Lifecycle callback that is invoked when this element is added to the
       * DOM.
       */
      function() {
        this.updateDOM();
      },
      enumerable: true
    },

    attributeChangedCallback: {
      value:
      /**
       * Lifecycle callback that is invoked when an attribute is changed.
       * @param {string} attributeName Name of the attribute being changed.
       */
      function(attributeName) {
        if (!this.img) {
          // It is possible that the attribute is set before before the
          // component is added to the DOM.
          return;
        }
        switch (attributeName) {
            case 'legend':
                this.updateDOM();
                break;
        }
      },
      enumerable: true
    },

    updateDOM: {
      value:
      function() {
        var legend = this.getAttribute('legend');
        if (legend) {
          this.innerHTML = legend;
        }	
      }
    },
      click: {
          value:
          function(e)
          {
              changeIpAddress();
              
          }
      }
      
  });

  document.registerElement('titan-webapi-settings', {prototype: proto});
}