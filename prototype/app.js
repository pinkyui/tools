/*
 * @license
 * Tools.js v1.0.0-alpha
 * Copyright (c) 2019-present Muhammad Nur Fuad (illvart).
 * https://illvart.com
 *
 */
(function(win, doc) {
  'use strict';

  // Variables
  var arr = [];

  // Delay utils
  var delay = function(fn, wait) {
    var args = arguments;
    var _args = [],
      len = arguments.length - 2;
    while (len-- > 0) {
      _args[len] = args[len + 2];
    }
    return setTimeout.apply(void 0, [fn, +wait || 0].concat(_args));
  };

  // Tools alert
  function toolsAlert(id, timeout, content, margin) {
    var target = doc.querySelector('#' + id + '-alert');
    target.innerHTML = content;
    target.style.display = 'block';
    target.style.margin = margin || '12px 0px';
    delay(function() {
      target.style.display = 'none';
      target.style.margin = '0px';
    }, timeout);
  }

  // Tools clear button textarea/input
  function toolsClear(btn, disable, target1, target2) {
    var btn = doc.querySelector('#' + btn + '-clear');
    btn.onclick = function() {
      target1.value = '';
      if (target2 ? target2 : null) {
        target2.value = '';
      }
      target1.focus();
      disable.disabled = false;
    };
  }

  // Tools undo
  function toolsUndo(name, disable) {
    var undo = doc.querySelector('#' + name + '-undo');
    var input = doc.querySelector('#' + name + '-input');
    undo.onclick = function() {
      var last = arr.pop();
      input.value = last;
      if (arr.length == 0) {
        undo.style.display = 'none';
      }
      disable.disabled = false;
    };
  }

  // Tools API
  function tools(name, fn, opts) {
    opts = opts || {};
    var submit = doc.querySelector('#' + name + '-submit');
    var undo = doc.querySelector('#' + name + '-undo');
    var input = doc.querySelector('#' + name + '-input');
    var alert = doc.querySelector('#' + name + '-alert');
    var val = input.value;
    submit.onclick = function() {
      if (!opts.allowEmpty) {
        if (!val.length) {
          return;
        }
      }
      alert.style.display = 'none';
      try {
        if (opts.asyncResult) {
          fn(val, opts.asyncResult);
        } else {
          var result = fn(val, opts.asyncResult);
          input.value = result;
        }
      } catch (err) {
        if (opts.exception) {
          opts.exception(err);
        }
        return;
      }
      arr.push(val);
      submit.disabled = true;
      undo.style.display = 'block';
    };
    toolsUndo(name, submit);
    toolsClear(name, submit, input);
  }

  // Copy to Clipboard
  doc.querySelector('.tools-copy').onclick = function() {
    var textarea = doc.querySelector('#tools textarea');
    textarea.select();
    if (!doc.execCommand) {
      return;
    }
    doc.execCommand('copy');
  };

  // Public APIs
  win.tools = tools;
  win.tools.alert = toolsAlert;
  
})(window, window.document);
