/*
 * @license
 * Tools.js v1.0.0-alpha
 * Copyright (c) 2019-present illvart
 * https://github.com/illvart
 */
(function(win, doc) {
  'use strict';

  var index;
  var arr = [];
  var empty = '';
  var textFile = null;

  // Polyfill String.prototype.endsWith()
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, len) {
      if (len === undefined || len > this.length) {
        len = this.length;
      }
      return this.substring(len - search.length, len) === search;
    };
  }

  // Utils
  var isString = function(val) {
    return typeof val === 'string';
  };
  var isFunction = function(val) {
    return typeof val === 'function';
  };
  var isObject = function(val) {
    return val !== null && typeof val === 'object';
  };
  var isEmpty = function(val) {
    return val === empty;
  };
  var has = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  var $ = function(el, selector) {
    if (isString(el)) {
      return doc.querySelector(el);
    } else {
      return el.querySelector(selector);
    }
  };
  var $$ = function(el, selector) {
    if (isString(el)) {
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
      if (isObject(obj)) {
        for (index in obj) {
          if (has(obj, index)) {
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
  var preventDefaults = function(event) {
    event.preventDefault();
    event.stopPropagation();
  };
  var endsWithAny = function(suffixes, str) {
    /*for (let suffix of suffixes) {
      if (str.endsWith(suffix)) {  
        return true;
      }
    }*/
    return suffixes.some(function(suffix) {
      if (str.endsWith(suffix)) {
        return true;
      }
    });
    return false;
  };
  /*
   * Ajax helper, get and post
   * 
   * Example:
     ajax.get('http://example.com/fa=foo&foo=faa', function(data) {
       console.log(data);
     });
     ajax.get('http://example.com/fa=foo&foo=faa', function(data) {
       console.log(JSON.parse(data));
     });
     ajax.post('http://example.com/', 'a=b&b=c', function(data) {
      console.log(data);
     });
     ajax.post('http://example.com/', { a: 'b', b: 'c' }, function(data) {
       console.log(data);
     });
   */
  var ajax = {
    get: function(url, cb) {
      var xhr = win.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('GET', url, true);
      // xhr.onreadystatechange
      // use onload because loaded full content?
      xhr.onload = function() {
        if (cb && isFunction(cb)) {
          cb(this);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send();
      return xhr;
    },
    post: function(url, data, cb) {
      var params = isString(data)
        ? data
        : Object.keys(data)
            .map(function(param) {
              return (
                encodeURIComponent(param) +
                '=' +
                encodeURIComponent(data[param])
              );
            })
            .join('&');
      var xhr = win.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('POST', url, true);
      xhr.onreadystatechange = function() {
        if (cb && isFunction(cb)) {
          cb(this);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
      return xhr;
    }
  };

  // Selector
  var $inout = function(name) {
    return $('#' + name + '-inout');
  };
  var $input = function(name) {
    return $('#' + name + '-input');
  };
  var $output = function(name) {
    return $('#' + name + '-output');
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
  // Example
  var $example = function(name) {
    return $('#' + name + '-example');
  };
  var $example_btn = function(name) {
    return $('#' + name + '-example-btn');
  };
  var $external = function(name) {
    return $('#' + name + '-external');
  };
  var $upload = function(name) {
    return $('#' + name + '-upload');
  };
  var $load = function(name) {
    return $('#' + name + '-load');
  };
  var $load_btn = function(name) {
    return $('#' + name + '-load-url');
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
  var fileSize = function(target) {
    if (target < 1024) {
      return target + ' Bytes';
    } else if (target >= 1024 && target < 1048576) {
      return (target / 1024).toFixed(1) + ' KB';
    } else if (target >= 1048576) {
      return (target / 1048576).toFixed(1) + ' MB';
    }
  };
  var fileMaxSize = function(target, max) {
    if (target > max) {
      return true;
    }
    return false;
  };
  var validateMimeType = function(file, types) {
    for (index = 0; index < types.length; index++) {
      if (file.type === types[index]) {
        return true;
      }
    }
    return false;
  };

  // create Download file
  var createDownloadFile = function(content, mimeType) {
    var blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
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

  // tools native SmoothScroll
  var toolsScrollTo = function(el) {
    win.scroll({
      behavior: 'smooth',
      left: 0,
      top: el.getBoundingClientRect().top + win.pageYOffset + -300
    });
  };
  var supportsSmoothScroll = 'scrollBehavior' in doc.documentElement.style;

  // Tools alert
  function toolsAlert(name, opts) {
    opts = opts || {};
    var type = opts.type ? opts.type : null;
    var canDelay = opts.delay.enable ? opts.delay.enable : false;
    var duration = opts.delay.duration ? opts.delay.duration : 0;
    var content = opts.content ? opts.content : null;
    var param = opts.param ? ' ' + opts.param : empty;
    var alert = $alert(name);
    if (!ifShowBlock(alert)) {
      alert.classList.add(type);
      alert.innerHTML = content + param;
      showBlock(alert);
    }
    var alertHide = function() {
      if (ifShowBlock(alert) && alert.classList.contains(type)) {
        hide(alert);
        alert.innerHTML = empty;
        alert.classList.remove('warning', 'danger', 'info');
      }
    };
    if (canDelay === true) {
      delay(alertHide, duration);
    } else {
      alertHide;
    }
  }
  // Tools Download
  function toolsDownload(download, output) {
    if (download) {
      var mimeType = download.getAttribute('data-download-type');
      showInline(download);
      // To retain the Line breaks
      output = output.replace(/\n/g, '\r\n');
      updateDownload(download, output, mimeType);
    }
  }
  // Tools copy clipboard
  function toolsCopy(name, copy, submit) {
    var inout = $inout(name);
    var input = $input(name);
    var output = $output(name);
    if (inout) {
      inout.addEventListener(
        'input',
        function() {
          if (isEmpty(inout.value)) {
            hide(copy);
          } else {
            showInline(copy);
          }
        },
        false
      );
    } else if (output) {
      submit.addEventListener(
        'click',
        function() {
          if (isEmpty(output.value)) {
            hide(copy);
          } else {
            showInline(copy);
          }
        },
        false
      );
    }
    copy.addEventListener('click', function(event) {
      event.preventDefault();
      if (inout) {
        inout.focus();
        inout.select();
      } else if (output) {
        output.focus();
        output.select();
      }
      if (!doc.execCommand) {
        return;
      }
      doc.execCommand('copy');
      if (supportsSmoothScroll) {
        if (inout) {
          toolsScrollTo(inout);
        } else if (output) {
          toolsScrollTo(output);
        }
      }
    });
  }
  // Tools undo
  function toolsUndo(name, undo, input, submit, copy, download) {
    var output = $output(name);
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
      if (output && isEmpty(output.value)) {
        hide(copy);
      } else if (ifHide(copy)) {
        showInline(copy);
      }
      enable(submit);
    });
  }
  // Tools size calculate original and output
  function toolsSize(size, original, output) {
    if (size) {
      showBlock(size);
      var diff = original.length - output.length;
      var saving = original.length
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
        saving +
        '%)</strong>.</span>';
    }
  }
  // Tools clear button textarea/input
  function toolsClear(name, clear, submit, copy, size, download) {
    var inout = $inout(name);
    var input = $input(name);
    var output = $output(name);
    clear.addEventListener(
      'click',
      function() {
        if (inout) {
          inout.value = empty;
          inout.focus();
        } else if (output) {
          output.value = empty;
          input.value = empty;
          input.focus();
        }
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
  function toolsOptions(options, settings, settingsText, submit) {
    if (options || settings || settingsText) {
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
      settingsText.addEventListener(
        'input',
        function() {
          if (ifShowBlock(settings)) {
            enable(submit);
          }
        },
        false
      );
    }
  }
  // Tools switch/checkbox
  function toolsSwitch(submit) {
    var switchs = $$('.tools-switch');
    if (switchs) {
      each(switchs, function(el) {
        el.addEventListener('click', enable.bind(null, submit), false);
      });
    }
  }
  // Tools auto expand textarea
  function toolsExpand(input, submit, clear, undo) {
    var maxHeight = 460;
    var expand = $('[data-tools-expand]', input);
    if (expand) {
      var autoExpand = function() {
        expand.style.height = 'auto'; // 'inherit'
        if (expand.scrollHeight > maxHeight) {
          expand.style.height = maxHeight + 'px';
        } else {
          expand.style.height = expand.scrollHeight + 'px';
          expand.style.maxHeight = maxHeight + 'px';
        }
      };
      expand.addEventListener('input', autoExpand, false);
      submit.addEventListener('click', autoExpand, false);
      clear.addEventListener('click', autoExpand, false);
      undo.addEventListener('click', autoExpand, false);
    }
  }
  // Tools example
  function toolsExample(example, exampleBtn) {
    if (example || exampleBtn) {
      var exampleToggle = $('#tools-example-toggle', example);
      exampleBtn.addEventListener(
        'click',
        function() {
          if (ifShowBlock(example)) {
            hide(example);
            exampleToggle.innerText = 'Show';
          } else {
            showBlock(example);
            exampleToggle.innerText = 'Hide';
          }
        },
        false
      );
    }
  }

  // Multiple FileReader
  var fileReader = function(
    input,
    file,
    mimeTypes,
    mimeHumans,
    maxSizeBytes,
    maxSizeHumans,
    alert,
    error,
    cb
  ) {
    if (win.FileReader) {
      each(file, function(files) {
        if (!validateMimeType(files, mimeTypes)) {
          toolsAlert(alert, {
            delay: {
              enable: true,
              duration: error.duration || 4000
            },
            type: error.type || 'warning',
            content:
              'File name ' +
              files.name +
              ': ' +
              (error.text ||
                'Not a valid file type. Update your selection file with type') +
              ' (' +
              mimeHumans +
              ').'
          });
        } else {
          if (fileMaxSize(files.size, maxSizeBytes)) {
            toolsAlert(alert, {
              delay: {
                enable: true,
                duration: error.duration || 4000
              },
              type: error.type || 'warning',
              content:
                'File name ' +
                files.name +
                ' is over size, maximum ' +
                maxSizeHumans +
                '.'
            });
          } else {
            var reader = new FileReader();
            reader.onload = function(event) {
              input.value = event.target.result;
              if (cb && isFunction(cb)) {
                cb(files);
              }
            };
            reader.readAsText(files);
          }
        }
      });
    }
  };
  // Tools drag
  function toolsDrag(input, alert, copy, submit, opts) {
    var drag = $('[data-tools-drag]', input);
    if (drag) {
      function dragFile(event) {
        preventDefaults(event);
        var dragError = opts.drag.error;
        var mimeTypes = opts.files.inputMimeTypes;
        var mimeHumans = opts.files.inputMimeHumans;
        var maxSizeBytes = opts.files.inputMaxSizeBytes;
        var maxSizeHumans = opts.files.inputMaxSizeHumans;
        var file = event.dataTransfer.files;

        // accept=".txt, .json, text/plain, application/json"
        // multiple
        // .js, .mjs, application/javascript, text/javascript, javascript/esm
        // text/xml, application/xml

        if (event.type === 'drop') {
          fileReader(
            input,
            file,
            mimeTypes,
            mimeHumans,
            maxSizeBytes,
            maxSizeHumans,
            alert,
            dragError,
            function() {
              showInline(copy);
              enable(submit);
            }
          );
        }
      }
      input.addEventListener('dragenter', dragFile, false);
      input.addEventListener('dragover', dragFile, false);
      input.addEventListener('drop', dragFile, false);
    }
  }
  // Tools upload
  function toolsUpload(external, upload, input, alert, copy, submit, opts) {
    if (external || upload) {
      function uploadFile(event) {
        preventDefaults(event);
        var uploadError = opts.upload.error;
        var mimeTypes = opts.files.inputMimeTypes;
        var mimeHumans = opts.files.inputMimeHumans;
        var maxSizeBytes = opts.files.inputMaxSizeBytes;
        var maxSizeHumans = opts.files.inputMaxSizeHumans;
        var file = event.target.files;
        var info = $('.tools-file-info', external);
        if (!info) {
          return;
        }
        fileReader(
          input,
          file,
          mimeTypes,
          mimeHumans,
          maxSizeBytes,
          maxSizeHumans,
          alert,
          uploadError,
          function(files) {
            showInline(copy);
            enable(submit);
            info.innerText =
              'File name ' +
              files.name +
              ', file size ' +
              fileSize(files.size) +
              '.';
          }
        );
      }
      upload.addEventListener('change', uploadFile, false);
    }
  }

  // Tools Load Url
  function toolsLoad(load, loadBtn, input, alert, copy, submit, opts) {
    // Use CORS with proxy because blogger :(
    var corsAPI = opts.loadURL.corsAPI || empty;
    if (load || loadBtn) {
      var loadUrl = function() {
        var loadEmpty = opts.loadURL.empty;
        var loadError = opts.loadURL.error;
        var loadFail = opts.loadURL.fail;
        var urlExtensions = opts.files.inputUrlExtensions;
        var urlHumans = opts.files.inputUrlHumans;
        var maxSizeBytes = opts.files.inputMaxSizeBytes;
        var maxSizeHumans = opts.files.inputMaxSizeHumans;
        if (isEmpty(load.value)) {
          toolsAlert(alert, {
            delay: {
              enable: true,
              duration: loadEmpty.duration || 1500
            },
            type: loadEmpty.type || 'warning',
            content: loadEmpty.text || 'Sorry, Input URL is empty!'
          });
        } else if (!endsWithAny(urlExtensions, load.value)) {
          toolsAlert(alert, {
            delay: {
              enable: true,
              duration: loadError.duration || 4000
            },
            type: loadError.type || 'warning',
            content:
              'URL ' +
              load.value +
              ': ' +
              (loadError.text ||
                'Not a valid URL. Update your input URL with valid extension or ends with') +
              ' (' +
              urlHumans +
              ').'
          });
        } else {
          input.value = opts.loadURL.loading || 'Loading...';
          input.readOnly = true;
          ajax.get(corsAPI + load.value, function(state) {
            input.readOnly = false;
            showInline(copy);
            enable(submit);
            var response = state.responseText;
            if (
              state.readyState === 4 &&
              state.status === 200 &&
              response.toLowerCase().indexOf('error') === -1
            ) {
              if (fileMaxSize(response.length, maxSizeBytes)) {
                toolsAlert(alert, {
                  delay: {
                    enable: true,
                    duration: loadError.duration || 4000
                  },
                  type: loadError.type || 'warning',
                  content:
                    'URL ' +
                    load.value +
                    ' that containing data is over size, maximum ' +
                    maxSizeHumans +
                    '.'
                });
                input.value = empty;
              } else {
                input.value = response;
              }
            } else if (state.readyState === 4) {
              toolsAlert(alert, {
                delay: {
                  enable: true,
                  duration: loadFail.duration || 4000
                },
                type: loadFail.type || 'danger',
                content:
                  loadFail.text ||
                  'Something has gone wrong, maybe server busy or invalid URL? <br>Try again later.'
              });
              input.value = empty;
            }
          });
        }
      };
      loadBtn.addEventListener('click', loadUrl, false);
    }
  }

  // Tools API
  function tools(name, fn, opts) {
    opts = opts || {};
    var set = opts.settings;

    var useInOut, useInput, possibleValue, possibleOutput, result, finalResult;

    // input, output
    useInOut = $inout(name);
    useInput = $input(name);
    // possible use inout or input
    var input = useInOut ? useInOut : useInput;
    var output = $output(name);

    var submit = $submit(name);
    var clear = $clear(name);
    var copy = $copy(name);
    var download = $download(name);
    var undo = $undo(name);

    var alert = $alert(name);
    var size = $size(name);

    var options = $options(name);
    var settings = $settings(name);
    var settingsText = $settings_text(name);

    var example = $example(name);
    var exampleBtn = $example_btn(name);

    var external = $external(name);
    var upload = $upload(name);
    var load = $load(name);
    var loadBtn = $load_btn(name);

    submit.addEventListener(
      'click',
      function() {
        possibleValue = input.value;
        if (isEmpty(possibleValue)) {
          toolsAlert(name, {
            delay: {
              enable: true,
              duration: set.empty.duration || 1500
            },
            type: set.empty.type || 'warning',
            content: set.empty.text || 'Sorry, Input is empty!'
          });
        } else {
          // Keep console clean after submit
          console.clear();
          // Avoid conflict show alert
          if (ifShowBlock(alert)) {
            hide(alert);
          }
          try {
            result = fn(possibleValue);

            possibleOutput = output ? output : useInOut;
            finalResult = possibleOutput.value = result;
            finalResult;

            if (possibleValue === finalResult) {
              enable(submit);
              // Show alert if input same as output
              toolsAlert(name, {
                delay: {
                  enable: true,
                  duration: set.sameAs.druation || 5000
                },
                type: set.sameAs.type || 'info',
                content:
                  set.sameAs.text ||
                  'Well done, the code already modified, maybe the code same output as this tool!'
              });
            } else {
              arr.push(possibleValue);
              disable(submit);
              showInline(undo);
              // Real output for size, download
              toolsSize(size, possibleValue, finalResult);
              toolsDownload(download, finalResult);
              // Avoid height the content then scroll to input
              if (supportsSmoothScroll) {
                if (useInOut) {
                  toolsScrollTo(useInOut);
                } else if (output) {
                  toolsScrollTo(output);
                }
              }
            }
          } catch (err) {
            if (opts.exception) {
              opts.exception(err);
            }
            return;
          }
          input.addEventListener('input', enable.bind(null, submit), false);
        }
      },
      false
    );
    toolsUndo(name, undo, input, submit, copy, download);
    toolsCopy(name, copy, submit);
    toolsClear(name, clear, submit, copy, size, download);
    toolsOptions(options, settings, settingsText, submit);
    toolsSwitch(submit);
    // Avoid downloaded the page
    if (download) {
      updateDownload(download);
    }
    toolsExpand(input, submit, clear, undo);
    toolsExample(example, exampleBtn);
    toolsDrag(input, name, copy, submit, opts);
    toolsUpload(external, upload, input, name, copy, submit, opts);
    toolsLoad(load, loadBtn, input, name, copy, submit, opts);
  }

  // Public APIs
  win.tools = tools;
  win.tools.alert = toolsAlert;
})(window, window.document);
