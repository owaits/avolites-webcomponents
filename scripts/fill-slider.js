    //
    // Style multiple input ranges
    // WARNING: each input range need to have an unique ID
    //
window.onload = function(){
    "use strict";
    const DEBUG = false;

    var inlineStyle = document.createElement('style');
    var rangeSelector = document.querySelectorAll('[type=range]');
    var inlineStyleContent = new Array;

    document.body.appendChild(inlineStyle);

    var eventname = new Event('input')

    for (let item of rangeSelector) {
      item.addEventListener('input', function() {
		var min = this.hasAttribute('min') ? this.getAttribute('min') : 0;
		var max = this.hasAttribute('max') ? this.getAttribute('max') : 100;
        let rangeInterval = Number(max - min);
        let rangePercent = (Number(this.value) + Math.abs(min)) / rangeInterval * 100;

        DEBUG ? console.log("#" + this.id + ": " + rangePercent + "%") : ''; // for debug

        writeStyle({
          id: this.id,
          percent: rangePercent
        });
      }, false);

      item.dispatchEvent(eventname); // update bars at startup
    }


    /**
     * Write Style element
     * 
     * @param {object} obj id: HTML id, percent: value
     */
    function writeStyle(obj) {
      var find = inlineStyleContent.map(x => x.id).indexOf(obj.id);
      var styleText = "";

      if (find === -1) {
        inlineStyleContent.push(obj)
      } else {
        inlineStyleContent[find] = obj;
      }

      for (let item of inlineStyleContent) {
        styleText += '#' + item.id + '::-webkit-slider-runnable-track{background-size:' + item.percent + '% 100%} ';
      }

      inlineStyle.textContent = styleText;
    }
}