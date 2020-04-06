if (document.registerElement) {

  var proto = Object.create(HTMLElement .prototype, {

    createdCallback: {
      value:
      function() {
          this.updateDOM();
          this.addEventListener('click', this.click);
          
          $(this).addClass('empty');
		  	  
		  addTitanStatusListener(this.getAttribute('user-number'),this,function(item){ return item["active"];}, (this.getAttribute('level')== 0), function(sender, status, defaultValue)
		  {
			if(!sender.hasAttribute('legend'))
                  sender.innerHTML = status["Legend"];               

			if(status["active"] != defaultValue)
			{			
				$(sender).addClass('active');
			}
			else
			{
				$(sender).removeClass('active');
              }

			$(sender).removeClass('empty');
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
            case 'icon':
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

          this.style = "cursor: pointer;text-align:center;vertical-align:middle;display: inline-block;"
          if (this.hasAttribute('icon') && this["icon"] != null)
              this.style += ";background-image: url('" + this['icon'] + "')"
      }
    },
      click: {
          value:
          function(e)
          {
              var userNumber = this.getAttribute('user-number');
              var level = this.getAttribute('level');
              if(userNumber && level)
			{
				var toggleState = this.hasAttribute('toggle') && this.getAttribute('state') == "On";
				if(toggleState)
				{	
					firePlayback(userNumber,0);  	
				}
				else
				{
					firePlayback(userNumber,level);  
				}

				this.setAttribute('state',toggleState ? "Off" : "On");
			}
              
          }
      }
      
  });

  document.registerElement('titan-playback-button', {prototype: proto});
}