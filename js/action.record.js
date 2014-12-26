/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

function ActionRecord() {
  this.start();
}

ActionRecord.prototype = {
  start: function() {
    window.shakeItManager.addAction(
      'record', 'Recorder',
      'Acceleration Recorder',
      'This will record acceleration data for further analysis.',
      this.onClick.bind(this));
  },

  onClick: function(evt) {
    console.log("Clicked: " + evt);
  }
};

var actionRecord = new ActionRecord();
