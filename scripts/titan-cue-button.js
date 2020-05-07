
if (document.registerElement) {

  var proto = Object.create(HTMLElement .prototype, {

    createdCallback: {
      value:
      function() {
          this.updateDOM();
          this.addEventListener('click',this.click);
          this.style = "cursor: pointer;text-align:center;vertical-align:middle;display: inline-block;"

          $(this).addClass('empty');
		  
		  addTitanStatusListener(this.getAttribute('user-number'),$(this),function(item){ return item["information"][1]["LiveCue"];}, this.getAttribute('cue'), function(sender, status, defaultValue)
          {
              if (!sender[0].hasAttribute('legend'))
                  sender[0].innerHTML = status["Legend"];     

			  var liveCue = status["information"][1]["LiveCue"];
			  var allCues = status["information"][0]["Cues"];
			  var liveCueNumber = allCues.indexOf(liveCue) + 1;
			    if(liveCueNumber == defaultValue)
			    {			
				    sender.addClass('active');
			    }
			    else
			    {
				    sender.removeClass('active');
              }

              sender.removeClass('empty');
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
              var userNumber = this.getAttribute('user-number');
              var cueNumber = this.getAttribute('cue');
              if(userNumber && cueNumber)
                {
					setNextCue(userNumber,cueNumber);
					go(userNumber);					  
                }
              
          }
      }
      
  });

  document.registerElement('titan-cue-button', {prototype: proto});
}