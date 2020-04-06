
if (document.registerElement) {
   
  var proto = Object.create(HTMLElement .prototype, {
    createdCallback: {
      value:
      function() {
          //var shadow = this.createShadowRoot();
          //this.updateDOM();
          this.addEventListener('click',this.click);
          
          var slider = document.createElement("input");
		  slider.id = "playbackFader_" + this.getAttribute('user-number');
          slider.type="range";
		  slider.value=0;
		  slider.setAttribute("orient","vertical");
          slider.setAttribute("type", "range");
          //slider.setAttribute("style","width:100%;height: 100%;");
                    
          this.appendChild(slider);
          this.addEventListener('input',this.input);
          this.style="cursor: pointer"
		  
		  addTitanStatusListener(this.getAttribute('user-number'),slider,function(item){ return item["information"][1]["Level"];}, 0, function(sender, status, defaultValue)
		  {
			var level = status["information"][1]["Level"];
			sender.value = level * 100;
		  });
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
        }
      },
      enumerable: true
    },
    slider:{
      value:
        document.createElement("input")
    },
    updateDOM: {
      value:
      function() {
        var legend = this.getAttribute('legend');
        if (legend) {
          //this.innerHTML = "<input class='fader' type='range' value='0' min='0' max='100' orient='vertical' style='-webkit-appearance: slider-vertical'/>";
          //this.img.setAttribute('src', QRCode.generatePNG(data));
        }	
      }
    },
      click: {
          value:
          function(e)
          {
              
          }
      },
      input: {
          value:
          function(e)
          {
              var adjustedLevel = e.target.value / 100.0;
              var userNumber = this.getAttribute('user-number');
              if(userNumber)
                {
					pauseTitanStatusListener(userNumber);
                    firePlayback(userNumber,adjustedLevel);  
                }              
          }
      }
      
  });

  document.registerElement('titan-playback-fader', {prototype: proto});
}