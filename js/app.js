/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

(function(exports) {

  function ShakeItManager() {
    this.actions = [];

    this.dropdown = document.getElementById('actions-items');
    this.details = document.getElementById('action-details');
  }

  ShakeItManager.prototype = {

    toggleDetails: function(visible) {
      if (!this.details) {
        return;
      }

      this.details.dataset.visible = visible;
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

    showDetails: function() {
      this.toggleDetails(true);
    },

    hideDetails: function() {
      this.toggleDetails(false);
    },
    
    addAction: function(id, name, title, desc, handler) {
      if (!(id in this.actions)) {
        this.actions[id] = {
          handler: handler,
          name: name,
          title: title,
          description: desc
        };
        this.updateUI(id, name);
      }
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
