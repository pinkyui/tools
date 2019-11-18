/*
 * @license
 * Tools.js v1.0.0-alpha
 * Copyright (c) 2019-present Muhammad Nur Fuad (illvart).
 * https://illvart.com
 */
(function(win, doc) {
  'use strict';

  var index;
  var arr = [];
  var empty = '';
  var textFile = null;

  var $ = function(el, selector) {
    if (typeof el === 'string') {
      return doc.querySelector(el);
    } else {
      return el.querySelector(selector);
    }
  };
  var $$ = function(el, selector) {
    if (typeof el === 'string') {
      return Array.prototype.slice.call(doc.querySelectorAll(el));
    } else {
      return Array.prototype.slice.call(el.querySelectorAll(selector));
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
  var each = function(obj, iterator, context) {
    var len;
    if (obj) {
      if (obj !== null && typeof obj === 'object') {
        for (index in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, index)) {
            iterator.call(context, obj[index], index, obj);
          }
        }
      } else {
        for (index = 0, len = obj.length; index < len; index++) {
          iterator.call(context, obj[index], index, obj);
        }
      }
    }
    return obj;
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

  // create Download file
  var createDownloadFile = function(content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      win.URL.revokeObjectURL(textFile);
    }
    textFile = win.URL.createObjectURL(blob);
    return textFile;
  };
  // Update Download
  var updateDownload = function(download, content, mimeType) {
    // javascript: text/javascript
    // text: text/plain
    // css: text/css
    // json: application/json
    // html: text/html
    // xml: text/xml
    // toml: application/toml *.toml
    // yaml: application/x-yaml *.yaml or *.yml
    content = content || empty;
    mimeType = mimeType || 'text/plain';
    // Avoid downloaded the page
    download.href = createDownloadFile(content, mimeType);
  };

  // Native SmoothScroll
  var toolsScrollTo = function(el) {
    win.scroll({
      behavior: 'smooth',
      left: 0,
      top: el.getBoundingClientRect().top + win.pageYOffset + -300
    });
  };
  var supportsSmoothScroll = 'scrollBehavior' in doc.documentElement.style;

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
  // Download
  var $download = function(name) {
    return $('#' + name + '-download');
  };
  // Show and Hide
  var showBlock = function(el) {
    return (el.style.display = 'block');
  };
  var showInline = function(el) {
    return (el.style.display = 'inline-block');
  };
  var hide = function(el) {
    return (el.style.display = 'none');
  };
  var ifHide = function(el) {
    return el.style.display === 'none';
  };
  var ifShowInline = function(el) {
    return el.style.display === 'inline-block';
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
  function toolsAlert(name, timeout, opts) {
    opts = opts || {};
    var type = opts.type ? opts.type : null;
    var content = opts.content ? opts.content : null;
    var param = opts.param ? ' ' + opts.param : '';
    var alert = $alert(name);
    alert.classList.add(type);
    alert.innerHTML = content + param;
    showBlock(alert);
    delay(function() {
      if (ifShowBlock(alert)) {
        hide(alert);
      }
      if (alert.classList.contains(type)) {
        alert.classList.remove(type);
      }
    }, timeout);
  }

  // Tools Download
  function toolsDownload(name, output) {
    var download = $download(name);
    if (!download) {
      return;
    }
    var mimeType = download.getAttribute('data-download-type');
    showInline(download);
    // To retain the Line breaks
    output = output.replace(/\n/g, '\r\n');
    updateDownload(download, output, mimeType);
  }

  // Tools copy clipboard
  function toolsCopy(name) {
    var copy = $copy(name);
    var input = $input(name);
    input.addEventListener(
      'input',
      function() {
        if (input.value === '') {
          hide(copy);
        } else {
          showInline(copy);
          copy.addEventListener('click', function(event) {
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
        }
      },
      false
    );
  }

  // Tools undo
  function toolsUndo(name, submit) {
    var undo = $undo(name);
    var input = $input(name);
    var download = $download(name);
    var copy = $copy(name);
    undo.addEventListener('click', function(event) {
      event.preventDefault();
      var last = arr.pop();
      input.value = last;
      if (arr.length === 0) {
        hide(undo);
      }
      if (download) {
        hide(download);
        updateDownload(download);
      }
      if (ifHide(copy)) {
        showInline(copy);
      }
      enable(submit);
    });
  }

  // Tools size calculate original and output
  function toolsSize(name, original, output) {
    var size = $size(name);
    if (!size) {
      return;
    }
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
      ' bytes</strong>.<br> Saving: <strong>' +
      commify(diff) +
      ' bytes (' +
      savings +
      '%)</strong>.</span>';
  }

  // Tools clear button textarea/input
  function toolsClear(name, input, submit) {
    var btn = $clear(name);
    var copy = $copy(name);
    var size = $size(name);
    var download = $download(name);
    btn.addEventListener(
      'click',
      function() {
        input.value = empty;
        input.focus();
        enable(submit);
        if (ifShowInline(copy)) {
          hide(copy);
        }
        if (size) {
          hide(size);
        }
        if (download) {
          hide(download);
          updateDownload(download);
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
          enable(submit);
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

  // Tools switch/checkbox
  function toolsSwitch(submit) {
    var sw = $$('.tools-switch');
    if (!sw) {
      return;
    }
    each(sw, function(el) {
      el.addEventListener(
        'click',
        function() {
          enable(submit);
        },
        false
      );
    });
  }

  // Tools API
  function tools(name, fn, opts) {
    opts = opts || {};

    var result, output;
    var submit = $submit(name);
    var input = $input(name);
    var undo = $undo(name);
    var alert = $alert(name);
    var download = $download(name);

    submit.addEventListener(
      'click',
      function() {
        var val = input.value;
        if (val === empty) {
          return toolsAlert(name, 1500, {
            type: 'warning',
            content: 'Please insert your <strong>code</strong> first!'
          });
        } else {
          hide(alert);
          try {
            result = fn(val);
            output = input.value = result;
            output;
            // Real output for size, download
            toolsSize(name, val, output);
            toolsDownload(name, output);
          } catch (err) {
            if (opts.exception) {
              opts.exception(err);
            }
            return;
          }

          arr.push(val);
          disable(submit);
          showInline(undo);
          // Avoid height the content then scroll to input
          if (supportsSmoothScroll) {
            toolsScrollTo(input);
          }

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
    toolsCopy(name);
    toolsClear(name, input, submit);
    toolsOptions(name, submit);
    toolsSwitch(submit);
    if (download) {
      updateDownload(download);
    }
  }

  // Public APIs
  win.tools = tools;
  win.tools.alert = toolsAlert;
})(window, window.document);
