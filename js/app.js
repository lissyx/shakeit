/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

(function(exports) {

  function ShakeItManager() {
    this.actions = [];

    this.dropdown = document.getElementById('actions-items');
    this.details = document.getElementById('action-details');
    this.controls = document.getElementById('action-controls');
    this.feedback = document.getElementById('action-feedback');

    this.bind();

    this.actionStarted = false;
    this.currentCallee = null;
  }

  ShakeItManager.prototype = {

    bind: function() {
      if (!this.controls) {
        return;
      }

      var start = this.controls.querySelector('#btn-start');
      var stop = this.controls.querySelector('#btn-stop');

      start.addEventListener('click', this.handleStart.bind(this));
      stop.addEventListener('click', this.handleStop.bind(this));

      this.updateStartStop();
    },

    toggleGeneric: function(target, visible) {
      if (!target) {
        return;
      }

      target.dataset.visible = visible;
    },

    toggleDetails: function(visible) {
      this.toggleGeneric(this.details, visible);
    },

    toggleControls: function(visible) {
      this.toggleGeneric(this.controls, visible);
    },

    toggleFeedback: function(visible) {
      this.toggleGeneric(this.feedback, visible);
    },

    showDetails: function() {
      this.toggleDetails(true);
      this.toggleControls(true);
      this.toggleFeedback(true);
    },

    hideDetails: function() {
      this.toggleDetails(false);
      this.toggleControls(false);
      this.toggleFeedback(false);
    },

    setDetails: function(title, content) {
      if (!this.details) {
        return;
      }

      this.hideDetails();

      var t = this.details.querySelector('.panel-title');
      var c = this.details.querySelector('.panel-body');

      t.textContent = title;
      c.textContent = content;

      this.showDetails();
    },
    
    addAction: function(id, name, title, desc, handler, start, stop) {
      if (!(id in this.actions)) {
        this.actions[id] = {
          handler: handler,
          name: name,
          title: title,
          description: desc,
          start: start,
          stop: stop
        };
        this.updateUI(id, name);
      }
    },

    updateStartStop: function() {
      var start = this.controls.querySelector('#btn-start');
      var stop = this.controls.querySelector('#btn-stop');

      if (!this.actionStarted) {
        start.setAttribute('enabled', 'enabled');
        start.removeAttribute('disabled');
        stop.setAttribute('disabled', 'disabled');
        stop.removeAttribute('enabled');
      } else {
        start.setAttribute('disabled', 'disabled');
        start.removeAttribute('enabled');
        stop.setAttribute('enabled', 'enabled');
        stop.removeAttribute('disabled');
      }
    },

    handleStart: function(evt) {
      console.debug('Start');
      this.actionStarted = true;
      this.updateStartStop();
      this.currentCallee.start(evt);
    },

    handleStop: function(evt) {
      console.debug('Stop');
      this.actionStarted = false;
      this.updateStartStop();
      this.currentCallee.stop(evt);
    },

    handleClick: function(evt) {
      if (!evt.target && !evt.target.dataset) {
        return;
      }

      var action = evt.target.dataset.action;
      if (!action) {
        return;
      }

      var callee = this.actions[action];
      if (!callee && !callee.handler) {
        return;
      }

      this.setDetails(callee.title, callee.description);

      callee.handler(evt);

      this.currentCallee = callee;
    },

    updateUI: function(id, name) {
      var li = document.createElement('li');
      var a = document.createElement('a');

      a.dataset.action = id;
      a.textContent = name;
      li.appendChild(a);

      li.addEventListener('click', this.handleClick.bind(this));

      this.dropdown.appendChild(li);
    }

  };

  exports.ShakeItManager = ShakeItManager;
}(window));

window.shakeItManager = new window.ShakeItManager();
