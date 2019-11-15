/*
 * @license
 * Tools.js v1.0.0-alpha
 * Copyright (c) 2019-present Muhammad Nur Fuad (illvart).
 * https://illvart.com
 *
 */
(function(win, doc) {
  'use strict';

  var arr = [];

  var $ = function(el, selector) {
    if (typeof el === 'string') {
      return doc.querySelector(el);
    } else {
      return el.querySelector(selector);
    }
  };
  var delay = function(fn, wait) {
    var args = arguments;
    var _args = [],
      len = arguments.length - 2;
    while (len-- > 0) {
      _args[len] = args[len + 2];
    }
    return setTimeout.apply(void 0, [fn, +wait || 0].concat(_args));
  };
  var commify = function(str) {
    return String(str)
      .split('')
      .reverse()
      .join('')
      .replace(/(...)(?!$)/g, '$1,')
      .split('')
      .reverse()
      .join('');
  };

  // Tools alert
  function toolsAlert(name, timeout, content) {
    var target = $('#' + name + '-alert');
    target.innerHTML = content;
    target.style.display = 'block';
    delay(function() {
      target.style.display = 'none';
    }, timeout);
  }

  // Tools undo
  function toolsUndo(name, submit) {
    var undo = $('#' + name + '-undo');
    var input = $('#' + name + '-input');
    undo.addEventListener(
      'click',
      function() {
        var last = arr.pop();
        input.value = last;
        if (arr.length === 0) {
          undo.style.display = 'none';
        }
        submit.disabled = false;
      },
      false
    );
  }

  // Tools size calculate original and output
  function toolsSize(name, original, output) {
    var size = $('#' + name + '-size');
    size.style.display = 'block';
    var diff = original.length - output.length;
    var savings = original.length
      ? ((100 * diff) / original.length).toFixed(2)
      : 0;
    size.innerHTML =
      'Original size: <strong>' +
      commify(original.length) +
      ' bytes</strong>.<br> Output size: <strong>' +
      commify(output.length) +
      ' bytes</strong>.<br> Savings: <strong>' +
      commify(diff) +
      ' bytes (' +
      savings +
      '%)</strong>.</span>';
  }

  // Tools clear button textarea/input
  function toolsClear(name, input, submit) {
    var btn = $('#' + name + '-clear');
    var size = $('#' + name + '-size');
    btn.addEventListener(
      'click',
      function() {
        input.value = '';
        input.focus();
        submit.disabled = false;
        if (size) {
          size.style.display = 'none';
        }
      },
      false
    );
  }

  // Tools options for config
  function toolsOptions(name) {
    var options = $('#' + name + '-options');
    var settings = $('#' + name + '-settings');
    if (!options || !settings) {
      return;
    }
    options.addEventListener(
      'click',
      function() {
        if (options.checked === true) {
          settings.style.display = 'block';
        } else {
          settings.style.display = 'none';
        }
      },
      false
    );
  }

  // Native SmoothScroll
  var toolsScrollTo = function(el) {
    win.scroll({
      behavior: 'smooth',
      left: 0,
      top: el.getBoundingClientRect().top + win.pageYOffset + -300
    });
  };
  var supportsSmoothScroll = 'scrollBehavior' in doc.documentElement.style;

  // Tools API
  function tools(name, fn, options) {
    options = options || {};
    var submit = $('#' + name + '-submit');
    var input = $('#' + name + '-input');
    var undo = $('#' + name + '-undo');
    var alert = $('#' + name + '-alert');
    var size = $('#' + name + '-size');
    submit.addEventListener(
      'click',
      function() {
        var val = input.value;
        if (val === '') {
          toolsAlert(
            name,
            1500,
            'Please insert your <strong>code</strong> first!'
          );
        }
        if (!options.allowEmpty) {
          if (!val.length) {
            return;
          }
        }
        alert.style.display = 'none';
        try {
          if (options.asyncResult) {
            fn(val, options.asyncResult);
          } else {
            var result = fn(val, options.asyncResult);
            var output = (input.value = result);
            output;
            if (size) {
              toolsSize(name, val, output);
            }
          }
        } catch (err) {
          if (options.exception) {
            options.exception(err);
          }
          return;
        }
        arr.push(val);
        submit.disabled = true;
        undo.style.display = 'inline-block';
      },
      false
    );
    toolsUndo(name, submit);
    toolsClear(name, input, submit);
    $('.tools-copy').addEventListener(
      'click',
      function() {
        input.select();
        if (!doc.execCommand) {
          return;
        }
        doc.execCommand('copy');
        if (supportsSmoothScroll) {
          toolsScrollTo(input);
        }
      },
      false
    );
    toolsOptions(name);
  }

  // Public APIs
  win.tools = tools;
  win.tools.alert = toolsAlert;
})(window, window.document);
