/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

function ActionRecord() {
  this.start();

  this.feedback = document.getElementById('action-feedback')
    .querySelector('.panel-body');
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
    this.data = [];
  },

  exportData: function() {
    var csv = [ '"time", "x", "y", "z"\n' ];

    this.data.forEach(d => {
      csv.push(d.date + ', ' + d.x + ', ' + d.y + ', ' + d.z + '\n');
    });

    var file = new Blob(csv, { type: "text/plain" });
    this.writeBlob(file, "shakeit/" + Date.now() + ".csv");
  },

  addShare: function(blob, name) {
    this.feedback.innerHTML +=
      '<div class="btn-group btn-group-justified" role="group">' +
      '   <div class="btn-group" role="group">' +
      '     <button type="button" class="btn btn-info" id="btn-share">Share</button>' +
      '   </div>' +
      '</div>';

    var share = document.getElementById('btn-share');
    if (!share) {
      console.debug("Unable to get access to share button");
      return;
    }

    share.addEventListener('click', function() {
      share.setAttribute('disabled', 'disabled');

      console.debug("Will share: " + name);
      var activity = new MozActivity({
        name: 'share',
        data: {
          blobs: [ blob ],
        }
      });

      activity.onerror = function() {
        console.debug("Mail sharing error: " + this.error);
        share.removeAttribute('disabled');
      };

      activity.onsuccess = function() {
        console.debug("Mail sharing success");
        share.removeAttribute('disabled');
      };
    });
  },

  writeBlob: function(blob, filename) {
    var sdcard = navigator.getDeviceStorage("sdcard");
    var request = sdcard.addNamed(blob, filename);

    var self = actionRecord;
    request.onsuccess = function() {
      var name = this.result;
      console.log('File "' + name + '" successfully wrote on the sdcard storage area');
      self.feedback.textContent = 'Written as: ' + filename;
      self.addShare(blob, filename);
    }

    request.onerror = function() {
      console.warn('Unable to write the file: ' + this.error);
      self.feedback.textContent = 'Error writing ' + filename + ': ' + this.error;
    }
  },

  roundValue: function(v) {
    return (Math.round(v*10000)/10000);
  },

  onDeviceMotion: function(event) {
    var acc = event.accelerationIncludingGravity;
    if (!acc) {
      return;
    }

    var self = actionRecord;

    self.feedback.textContent = '' +
      'x=' + self.roundValue(acc.x) + '; ' +
      'y=' + self.roundValue(acc.y) + '; ' +
      'z=' + self.roundValue(acc.z) + '; ';

    self.data.push({
      date: (new Date() - self.startDate),
      x: acc.x,
      y: acc.y,
      z: acc.z
    });
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
    this.startDate = new Date();
    this.startDeviceMotion();
  },

  onStop: function(evt) {
    console.log("Clicked: ", evt);
    this.feedback.textContent = 'Stopped';
    this.stopDeviceMotion();
    this.exportData();
    this.data = [];
  },

  onClick: function(evt) {
    console.log("Clicked: ", evt);
  }
};

var actionRecord = new ActionRecord();
