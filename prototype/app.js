/*
 * @license
 * Tools.js v1.0.0-alpha
 * Copyright (c) 2019-present Muhammad Nur Fuad (illvart).
 * https://illvart.com
 */
(function(win, doc) {
  'use strict';

  var arr = [];
  var empty = '';

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
      .split(empty)
      .reverse()
      .join(empty)
      .replace(/(...)(?!$)/g, '$1,')
      .split(empty)
      .reverse()
      .join(empty);
  };

  // Selector
  var $input = function(name) {
    return $('#' + name + '-input');
  };
  var $submit = function(name) {
    return $('#' + name + '-submit');
  };
  var $clear = function(name) {
    return $('#' + name + '-clear');
  };
  var $copy = function(name) {
    return $('#' + name + '-copy');
  };
  var $alert = function(name) {
    return $('#' + name + '-alert');
  };
  var $undo = function(name) {
    return $('#' + name + '-undo');
  };
  var $size = function(name) {
    return $('#' + name + '-size');
  };

  // Options
  var $options = function(name) {
    return $('#' + name + '-options');
  };
  var $settings = function(name) {
    return $('#' + name + '-settings');
  };
  var $settings_text = function(name) {
    return $('#' + name + '-settings textarea');
  };

  // Show and Hide
  var showBlock = function(el) {
    return (el.style.display = 'block');
  };
  var showInline = function(el) {
    return (el.style.display = 'inline-block');
  };
  var hide = function(el) {
    return (el.style.display = null);
  };
  var ifShowBlock = function(el) {
    return el.style.display === 'block';
  };

  // Disabled and Enabled
  var disable = function(el) {
    return (el.disabled = true);
  };
  var enable = function(el) {
    if (el.disabled === true) {
      return (el.disabled = false);
    }
  };

  // Checkbox
  var checked = function(el) {
    return el.checked === true;
  };

  // Tools alert
  function toolsAlert(name, timeout, content, param) {
    var target = $alert(name);
    var text = param ? ' ' + param : '';
    target.innerHTML = content + text;
    showBlock(target);
    delay(function() {
      hide(target);
    }, timeout);
  }

  // Tools undo
  function toolsUndo(name, submit) {
    var undo = $undo(name);
    var input = $input(name);
    undo.addEventListener('click', function(event) {
      event.preventDefault();
      var last = arr.pop();
      input.value = last;
      if (arr.length === 0) {
        hide(undo);
      }
      enable(submit);
    });
  }

  // Tools size calculate original and output
  function toolsSize(name, original, output) {
    var size = $size(name);
    showBlock(size);
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
    var btn = $clear(name);
    var size = $size(name);
    btn.addEventListener(
      'click',
      function() {
        input.value = empty;
        input.focus();
        enable(submit);
        if (size) {
          hide(size);
        }
      },
      false
    );
  }

  // Tools options for config
  function toolsOptions(name, submit) {
    var options = $options(name);
    var settings = $settings(name);
    var textarea = $settings_text(name);
    if (!options || !settings || !textarea) {
      return;
    }
    options.addEventListener(
      'click',
      function() {
        if (checked(options)) {
          showBlock(settings);
        } else {
          hide(settings);
        }
      },
      false
    );
    textarea.addEventListener(
      'input',
      function() {
        if (ifShowBlock(settings)) {
          enable(submit);
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
  function tools(name, fn, opts) {
    opts = opts || {};

    var submit = $submit(name);
    var input = $input(name);
    var undo = $undo(name);
    var size = $size(name);
    var alert = $alert(name);

    submit.addEventListener(
      'click',
      function() {
        var val = input.value;
        if (val === empty) {
          toolsAlert(
            name,
            1500,
            'Please insert your <strong>code</strong> first!'
          );
        } else {
          hide(alert);
          try {
            var result = fn(val);
            var output = (input.value = result);
            output;
            if (size) {
              toolsSize(name, val, output);
            }
          } catch (err) {
            if (opts.exception) {
              opts.exception(err, val);
            }
            return;
          }

          arr.push(val);
          disable(submit);
          showInline(undo);

          input.addEventListener(
            'input',
            function() {
              enable(submit);
            },
            false
          );
        }
      },
      false
    );

    toolsUndo(name, submit);
    toolsClear(name, input, submit);

    $copy(name).addEventListener('click', function(event) {
      event.preventDefault();
      input.select();
      if (!doc.execCommand) {
        return;
      }
      doc.execCommand('copy');
      if (supportsSmoothScroll) {
        toolsScrollTo(input);
      }
    });

    toolsOptions(name, submit);
  }

  // Public APIs
  win.tools = tools;
  win.tools.alert = toolsAlert;
})(window, window.document);
