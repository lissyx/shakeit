/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

const kExcitementThreshold = 500;

function ActionLogShakeOriginal() {
  this.start();

  this.feedback = document.getElementById('action-feedback')
    .querySelector('.panel-body');
}

ActionLogShakeOriginal.prototype = {
  start: function() {
    window.shakeItManager.addAction(
      'logshakeorig', 'LogShake Orig.',
      'Original LogShake',
      'Original LogShake implementation for detecting when device is shaked, by James Hobin.',
      this.onClick.bind(this),
      this.onStart.bind(this),
      this.onStop.bind(this));
  },

  onDeviceMotion: function(event) {
    var acc = event.accelerationIncludingGravity;
    if (!acc) {
      return;
    }

    var self = actionLogShakeOriginal;
    var excitement = acc.x * acc.x + acc.y * acc.y + acc.z * acc.z;
    if (excitement > kExcitementThreshold) {
      self.feedback.textContent = "Above threshold: " + excitement;
    }
  },

  startDeviceMotion: function() {
    window.addEventListener('devicemotion', this.onDeviceMotion);
  },

  stopDeviceMotion: function() {
    window.removeEventListener('devicemotion', this.onDeviceMotion);
  },

  onStart: function(evt) {
    console.log("Clicked: ", evt);
    this.feedback.textContent = 'Started';
    this.startDeviceMotion();
  },

  onStop: function(evt) {
    console.log("Clicked: ", evt);
    this.feedback.textContent = 'Stopped';
    this.stopDeviceMotion();
  },

  onClick: function(evt) {
    console.log("Clicked: ", evt);
  }
};

var actionLogShakeOriginal = new ActionLogShakeOriginal();
