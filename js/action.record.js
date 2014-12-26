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
      this.onClick.bind(this),
      this.onStart.bind(this),
      this.onStop.bind(this));
  },

  onStart: function(evt) {
    console.log("Clicked: ", evt);
  },

  onStop: function(evt) {
    console.log("Clicked: ", evt);
  },

  onClick: function(evt) {
    console.log("Clicked: ", evt);
  }
};

var actionRecord = new ActionRecord();
