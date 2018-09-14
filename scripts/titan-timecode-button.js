if (document.registerElement) {

  var proto = Object.create(HTMLElement .prototype, {

    createdCallback: {
      value:
      function() {
          this.updateDOM();
          this.addEventListener('click',this.click);
          this.style="cursor: pointer;text-align:center;vertical-align:middle;display: inline-block;"
		  $(this).addClass('empty');

          var action = this.getAttribute('action');

          var propertyPrefix = "Timecode.TimecodeOne";
          switch (parseInt(this.getAttribute('sourceIndex'))) {
              case 1:
                  propertyPrefix = "Timecode.TimecodeOne"
                  break;
              case 2:
                  propertyPrefix = "Timecode.TimecodeTwo"
                  break;
              case 3:
                  propertyPrefix = "Timecode.TimecodeThree"
                  break;
              case 4:
                  propertyPrefix = "Timecode.TimecodeFour"
                  break;
          }

          if (action == "enable") {
              addTitanPropertyListener(this, "Timecode.Enabled", (this.getAttribute('enable') == "true" ? true : false), function (sender, value, defaultValue) {
                  if (value == defaultValue) {
                      $(sender).addClass('active');
                  }
                  else {
                      $(sender).removeClass('active');
                  }

                  $(sender).removeClass('empty');
              });
          }

          if (action == "source") {
              var sourceType = 1;
              switch (this.getAttribute('source')) {
                  case "None":
                      sourceType = 0;
                      break;
                  case "Internal":
                      sourceType = 1;
                      break;
                  case "UsbExpert":
                      sourceType = 2;
                      break;
                  case "Winamp":
                      sourceType = 3;
                      break;
                  case "System":
                      sourceType = 4;
                      break;
                  case "Smpte":
                      sourceType = 5;
                      break;
              }

              addTitanPropertyListener(this, propertyPrefix + ".Source", sourceType, function (sender, value, defaultValue) {
                  if (value == defaultValue) {
                      $(sender).addClass('active');
                  }
                  else {
                      $(sender).removeClass('active');
                  }

                  $(sender).removeClass('empty');
              });
          }

          if (action == "pause") {
              addTitanPropertyListener(this, propertyPrefix + ".Paused", (action == "pause" ? true : false), function (sender, value, defaultValue) {
                  if (value == defaultValue) {
                      $(sender).addClass('active');
                  }
                  else {
                      $(sender).removeClass('active');
                  }

                  $(sender).removeClass('empty');
              });
          }
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
          case 'user-number':
            this.updateDOM();
            break;
          case 'level':
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
              var action = this.getAttribute('action');
              var enable = this.getAttribute('enable');
              var sourceIndex = this.getAttribute('sourceIndex');
              var source = this.getAttribute('source');

              if (!action)
                  alert("No action has been set for this timecode button!");

              switch (action) {
                  case 'source':
                      if (sourceIndex && source) setTimecodeSource(sourceIndex, source);
                      break;
                  case 'play':
                      if (sourceIndex) playTimecode(sourceIndex);
                      break;
                  case 'pause':
                      if (sourceIndex) pauseTimecode(sourceIndex);
                      break;
                  case 'restart':
                      if (sourceIndex) restartTimecode(sourceIndex);
                      break;
                  case 'enable':
                      if (enable) enableTimecode(enable);
                      break;
              }              
          }
      }
      
  });

  document.registerElement('titan-timecode-button', {prototype: proto});
}