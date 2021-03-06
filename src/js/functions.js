var $WINDOW = $(window),
    $DOC = $(document),
    $HTML = $('html'),
    $BODY = $('body');

var DESKTOP_WIDTH = 992,
    TABLET_WIDTH = 768;

/**
 * !Resize only width
 */
var resizeByWidth = true;
var prevWidth = -1;
$WINDOW.resize(function () {
  var currentWidth = $BODY.outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $WINDOW.trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});


/**
 * !Device detected
 */
var DESKTOP = device.desktop();
var MOBILE = device.mobile();
var TABLET = device.tablet();


/**
 * !Placeholder for old browsers
 */
function placeholderInit() {
  $('[placeholder]').placeholder();
}


/**
 * !Custom scroll
 */
function customScroll() {
  // Custom scroll for nav drop
  var $navDropScroll = $('.nav-drop');
  if ($navDropScroll.length) {
    $navDropScroll.mCustomScrollbar({
      theme: "minimal-dark",
      autoHideScrollbar: true,
      autoExpandScrollbar: true,
      scrollInertia: 300
    });
  }

  // Custom scroll for sidebar
  var $sidebarScroll = $('.sidebar__holder');
  if ($sidebarScroll.length) {
    $sidebarScroll.mCustomScrollbar({
      theme: "minimal-dark",
      autoHideScrollbar: true,
      autoExpandScrollbar: true,
      scrollInertia: 300,
    });
  }

  // Custom scroll for menu
  var $menuScroll = $('.menu__holder');
  if ($menuScroll.length) {
    $menuScroll.mCustomScrollbar({
      theme: "minimal-dark",
      autoHideScrollbar: true,
      autoExpandScrollbar: true,
      scrollInertia: 300
    });
  }

  // Custom scroll for sidebar filters drop
  var $sidebarFiltersDrop = $('.filters-drop');
  if ($sidebarFiltersDrop.length) {
    $sidebarFiltersDrop.mCustomScrollbar({
      theme: "minimal-dark",
      autoHideScrollbar: true,
      autoExpandScrollbar: true,
      scrollInertia: 300
    });
  }
}


/**
 * !Show/hide promo section on scroll
 */
function togglePromoOnScroll() {
  // detect if IE : from http://stackoverflow.com/a/16657946
  var ie = (function () {
    var undef, rv = -1; // Return value assumes failure.
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
      // IE 10 or older => return version number
      rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    } else if (trident > 0) {
      // IE 11 (or newer) => return version number
      var rvNum = ua.indexOf('rv:');
      rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
    }

    return ((rv > -1) ? rv : undef);
  }());


  // disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = [32, 37, 38, 39, 40], wheelIter = 0;

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  function keydown(e) {
    for (var i = keys.length; i--;) {
      if (e.keyCode === keys[i]) {
        preventDefault(e);
        return;
      }
    }
  }

  function touchmove(e) {
    preventDefault(e);
  }

  function wheel(e) {
    // for IE
    //if( ie ) {
    //preventDefault(e);
    //}
  }

  function disable_scroll() {
    window.onmousewheel = document.onmousewheel = wheel;
    document.onkeydown = keydown;
    document.body.ontouchmove = touchmove;
  }

  function enable_scroll() {
    window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
  }

  var docElem = window.document.documentElement,
      scrollVal,
      isRevealed,
      noscroll,
      isAnimating,
      // container = document.getElementById( 'container' ),
      // trigger = container.querySelector( 'button.trigger' );
      container = document.body,
      $container = $(container),
      trigger = container.querySelector('a.trigger-js');

  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  function scrollPage() {
    scrollVal = scrollY();

    if (noscroll && !ie) {
      if (scrollVal < 0) return false;
      // keep it that way
      window.scrollTo(0, 0);
    }

    // if( classie.has( container, 'notrans' ) ) {
    //   classie.remove( container, 'notrans' );
    //   return false;
    // }
    if ($container.hasClass('notrans')) {
      $container.remove('notrans');
      return false;
    }

    if (isAnimating) {
      return false;
    }

    if (scrollVal <= 0 && isRevealed) {
      toggle(0);
    } else if (scrollVal > 0 && !isRevealed) {
      toggle(1);
    }
  }

  function toggle(reveal) {
    isAnimating = true;

    if (reveal) {
      // classie.add( container, 'modify' );
      $container.addClass('modify');
    } else {
      noscroll = true;
      disable_scroll();
      // classie.remove(container, 'modify');
      $container.removeClass('modify');
    }

    // simulating the end of the transition:
    setTimeout(function () {
      isRevealed = !isRevealed;
      isAnimating = false;
      if (reveal) {
        noscroll = false;
        enable_scroll();
      }
    }, 1200);
  }

  // refreshing the page...
  var pageScroll = scrollY();
  noscroll = pageScroll === 0;

  disable_scroll();

  if (pageScroll) {
    isRevealed = true;
    // classie.add(container, 'notrans');
    // classie.add(container, 'modify');
    $container.addClass('notrans');
    $container.addClass('modify');
  }

  window.addEventListener('scroll', scrollPage);
  trigger.addEventListener('click', function () {
    toggle('reveal');
  });
}


/**
 * !Form fields state
 */
function stateFields() {
  $('.is-validate select').on('change', function () {
    var $currentSelect = $(this);
    var selectedOptionIndex = $currentSelect.find('option:selected').index();
    var completeClass = 'input-complete';

    $currentSelect
        .toggleClass(completeClass, selectedOptionIndex !== 0)
        .closest('.select')
        .toggleClass(completeClass, selectedOptionIndex !== 0);
  });

  $(".is-validate input, .is-validate textarea").on('change keyup', function () {
    var _textDefault = $(this).val().length;
    $(this).toggleClass('input-complete', !!_textDefault);
  });
}


/**
 * !Search toggle
 */
function searchToggle() {
  var $searchOpen = $('.btn-search-open-js');
    var $searchForm = $('.search-panel-js');
  var timeout;

  if ($searchOpen.length) {
    $searchOpen.switchClass({
      switchClassTo: $searchForm,
      removeExisting: true,
      cssScrollFixed: false,
      removeEl: $('.menu-close-js'),
      modifiers: {
        activeClass: 'active'
      },
      afterAdd: function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          $searchForm.find('input[type="search"]').focus();
        }, 50);
      }
    });
  }

  // Открыть поле поиска если в url хэш #open-search
  if (document.location.hash === "#open-search") {
    setTimeout(function () {
      $searchOpen.switchClass('add');

      $searchForm.find('input[type="search"]').focus();
    }, 1000);
  }
}


/**
 * !Tabs initialize
 */
function tabs() {
  var $headerCategories = $('.js-header-categories');
  var $helpfulTabs = $('.js-tabs');
  var equalTimer;

  if ($helpfulTabs) {
    $helpfulTabs.responsiveTabs({
      active: 0,
      rotate: false,
      startCollapsed: 'accordion',
      collapsible: 'accordion',
      setHash: false,
      animation: 'fade', // slide
      duration: 300, // default 500
      animationQueue: true,
      activate: function (event, tab) {
        clearTimeout(equalTimer);
        equalTimer = setTimeout(function () {
          equalHeightForTabs($(tab.panel));
        }, 500);

        $('li', $headerCategories).removeClass('active');
        $('a[href="' + tab.selector + '"]', $headerCategories).closest('li').addClass('active');
      },
    });
  }

  $headerCategories.on('click', 'a', function (event) {
    var $curTab = $(this);
    var href = $curTab.attr('href');

    if (href[0] === '#') {
      $('a[href="' + href + '"]', $helpfulTabs).trigger('click');

      if (!$(this).is(':animated')) {
        $('html,body').stop().animate({scrollTop: $helpfulTabs.offset().top - $('.header').innerHeight() + 1}, 600);
      }

      event.preventDefault();
    }
  })
}

function equalHeightForTabs(content) {
  var $parent = $('.products__list', content);
  if ($parent.length) {
    $('.products__inner', $parent).equalHeight({
      useParent: true,
      parent: $parent,
      resize: true
    });
  }
}


/**
 * !Equal height elements
 */
function equalHeightInit() {
  /*previews*/
  var $previewsList = $('.previews__list');
  if ($previewsList.length) {
    imagesLoaded($previewsList, function () {
      var $previewsInner = $('.previews__inner');
      $previewsInner.equalHeight({
        // useParent: true,
        // parent: $previewsList,
        resize: true,
        amount: $previewsInner.length
      });
    });
  }

  /*products*/
  var $products = $('.products');
  if ($products.length) {
    imagesLoaded($products, function () {
      var $productsInner = $('.products__inner', $products);
      var elementLength = $productsInner.length;
      $('.products__content', $products).equalHeight({
        amount: elementLength,
        resize: true
      });

      filtersEvents();
      showFilterByHash();
      hideMobFiltersMenuTrigger();

      var category = getQueryVariable('filter-preset-cat');
      var brand = getQueryVariable('filter-preset-brand');

      if ($.trim(category)) {
        $('.filter-js[data-filter=".tag-' + category + '"]').prop('checked', true).trigger('change');
        // $('a[href*="filter-preset-cat=' + category + '"]').parent().addClass('current');
      }
      if ($.trim(brand)) {
        $('.filter-js[data-filter=".tag-' + brand + '"]').prop('checked', true).trigger('change');
        // $('a[href*="filter-preset-brand=' + brand + '"]').parent().addClass('current');
      }
    });
  }
}


/**
 * !Multiselect initialize
 */
/* add ui position add class */
function addPositionClass(position, feedback, obj) {
  removePositionClass(obj);
  obj.css(position);
  obj
      .addClass(feedback.vertical)
      .addClass(feedback.horizontal);
}

/*add ui position remove class*/
function removePositionClass(obj) {
  obj.removeClass('top');
  obj.removeClass('bottom');
  obj.removeClass('center');
  obj.removeClass('left');
  obj.removeClass('right');
}

function customSelect() {
  var select = $('select.cselect');
  if (select.length) {
    selectArray = [];
    select.each(function (selectIndex, selectItem) {
      var placeholderText = $(selectItem).attr('data-placeholder');
      var flag = true;
      if (placeholderText === undefined) {
        placeholderText = $(selectItem).find(':selected').html();
        flag = false;
      }
      var classes = $(selectItem).attr('class');
      selectArray[selectIndex] = $(selectItem).multiselect({
        header: false,
        height: 'auto',
        minWidth: 50,
        selectedList: 1,
        classes: classes,
        multiple: false,
        noneSelectedText: placeholderText,
        show: ['fade', 100],
        hide: ['fade', 100],
        create: function (event) {
          var select = $(this);
          var button = $(this).multiselect('getButton');
          var widget = $(this).multiselect('widget');
          button.wrapInner('<span class="select-inner"></span>');
          button.find('.ui-icon').append('<i class="arrow-select"></i>')
              .siblings('span').addClass('select-text');
          widget.find('.ui-multiselect-checkboxes li:last')
              .addClass('last')
              .siblings().removeClass('last');
          if (flag) {
            $(selectItem).multiselect('uncheckAll');
            $(selectItem)
                .multiselect('widget')
                .find('.ui-state-active')
                .removeClass('ui-state-active')
                .find('input')
                .removeAttr('checked');
          }
        },
        selectedText: function (number, total, checked) {
          var checkedText = checked[0].title;
          return checkedText;
        },
        position: {
          my: 'left top',
          at: 'left bottom',
          using: function (position, feedback) {
            addPositionClass(position, feedback, $(this));
          }
        }
      });
    });
    $WINDOW.resize(selectResize);
  }
}

function selectResize() {
  if (selectArray.length) {
    $.each(selectArray, function (i, el) {
      var checked = $(el).multiselect('getChecked');
      var flag = true;
      if (!checked.length) {
        flag = false;
      }
      $(el).multiselect('refresh');
      if (!flag) {
        $(el).multiselect('uncheckAll');
        $(el)
            .multiselect('widget')
            .find('.ui-state-active')
            .removeClass('ui-state-active')
            .find('input')
            .removeAttr('checked');
      }
      $(el).multiselect('close');
    });
  }
}

/**
 * !jquery.switch-class.js
 * !Version: 2.0
 * !Description: Extended toggle class
 */
(function ($) {
  // 'use strict';

  // Нужно для корректной работы с доп. классом блокирования скролла
  var countFixedScroll = 0;

  // Inner Plugin Modifiers
  var CONST_MOD = {
    instanceClass: 'swc-instance',
    initClass: 'swc-initialized',
    activeClass: 'swc-active',
    preventRemoveClass: 'swc-prevent-remove'
  };

  // Class definition
  // ================

  var SwitchClass = function (element, config) {
    var self = this, elem;
    self.element = element;
    self.config = config;
    self.mixedClasses = {
      initialized: CONST_MOD.initClass + ' ' + (config.modifiers.initClass || ''),
      active: CONST_MOD.activeClass + ' ' + (config.modifiers.activeClass || ''),
      scrollFixedClass: 'css-scroll-fixed'
    };
    self.$switchClassTo = $(config.toggleEl).add(config.addEl).add(config.removeEl).add(config.switchClassTo);
    self._classIsAdded = false;
  };

  $.extend(SwitchClass.prototype, {
    callbacks: function () {
      var self = this;
      /** track events */
      $.each(self.config, function (key, value) {
        if (typeof value === 'function') {
          $(self.element).on('switchClass.' + key, function (e, param) {
            return value(e, $(self.element), param);
          });
        }
      });
    },
    prevent: function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    toggleFixedScroll: function () {
      var self = this;
      $('html').toggleClass(self.mixedClasses.scrollFixedClass, !!countFixedScroll);
    },
    add: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (self._classIsAdded) return;

      // Callback before added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.beforeAdd')
          .trigger('switchClass.beforeChange');

      if (self.config.removeExisting) {
        $.switchClass.remove(true);
      }

      // Добавить активный класс на:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .addClass(self.mixedClasses.active);

      // Сохранить в дата-атрибут текущий объект this
      // $(self.element).data('SwitchClass', self);
      $currentEl.addClass(CONST_MOD.instanceClass).data('SwitchClass', self);

      self._classIsAdded = true;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
        ++countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback after added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.afterAdd')
          .trigger('switchClass.afterChange');
    },
    remove: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (!self._classIsAdded) return;

      // callback beforeRemove
      $currentEl
          .trigger('switchClass.beforeRemove')
          .trigger('switchClass.beforeChange');

      // Удалять активный класс с:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .removeClass(self.mixedClasses.active);

      // Удалить дата-атрибут, в котором хранится объект
      $currentEl.removeClass(CONST_MOD.instanceClass).removeData('SwitchClass');

      self._classIsAdded = false;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
        --countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback afterRemove
      $currentEl
          .trigger('switchClass.afterRemove')
          .trigger('switchClass.afterChange');
    },
    events: function () {
      var self = this;

      function _toggleClass(e) {
        if (self._classIsAdded && e.handleObj.origType !== "mouseenter") {
          self.remove();

          e.preventDefault();
          return false;
        }

        self.add();

        self.prevent(e);
      }

      if (self.config.selector) {
        $(self.element)
            .off(self.config.eventType, self.config.selector)
            .on(self.config.eventType, self.config.selector, _toggleClass);
      } else {
        $(self.element)
            .off(self.config.eventType)
            .on(self.config.eventType, _toggleClass);
      }

      $(self.config.toggleEl).on('click', _toggleClass);

      $(self.config.addEl).on('click', function (event) {
        self.add();
        self.prevent(event);
      });

      $(self.config.removeEl).on('click', function (event) {
        self.remove();
        self.prevent(event);
      })

    },
    removeByClickOutside: function () {
      var self = this;

      $('html').on('click', function (event) {

        if ($(event.target).closest('.' + CONST_MOD.preventRemoveClass).length) {
          return;
        }

        if ($(event.target).closest('[data-swc-prevent-remove]').length) {
          return;
        }

        if (self.config.preventRemoveClass && $(event.target).closest('.' + self.config.preventRemoveClass).length) {
          return;
        }

        if (self._classIsAdded && self.config.removeOutsideClick) {
          self.remove();
        }
      });
    },
    removeByClickEsc: function () {
      var self = this;

      $('html').keyup(function (event) {
        if (self._classIsAdded && self.config.removeEscClick && event.keyCode === 27) {
          self.remove();
        }
      });
    },
    init: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if ($currentEl.hasClass(self.config.modifiers.activeClass) || $currentEl.hasClass(CONST_MOD.activeClass)) {
        self.add();
      }

      $currentEl.addClass(self.mixedClasses.initialized);
      $currentEl.trigger('switchClass.afterInit');
    }
  });

  $.switchClass = {
    version: "2.0",
    getInstance: function (command) {
      var instance = $('.' + CONST_MOD.instanceClass + '.' + CONST_MOD.activeClass + ':last').data("SwitchClass"),
          args = Array.prototype.slice.call(arguments, 1);

      if (instance instanceof SwitchClass) {
        if ($.type(command) === "string") {
          instance[command].apply(instance, args);
        } else if ($.type(command) === "function") {
          command.apply(instance, args);
        }

        return instance;
      }

      return false;
    },
    remove: function (all) {
      // Получить текущий инстанс
      var instance = this.getInstance();

      // Если инстанс существует
      if (instance) {

        instance.remove();

        // Try to find and close next instance
        // 2) Если на вход функуии передан true,
        if (all === true) {
          // то попитаться найти следующий инстанс и запустить метод .close для него
          this.remove(all);
        }
      }
    },
  };

  function _run(el) {
    el.switchClass.callbacks();
    el.switchClass.events();
    el.switchClass.removeByClickOutside();
    el.switchClass.removeByClickEsc();
    el.switchClass.init();
  }

  $.fn.switchClass = function (options) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        self[i].switchClass = new SwitchClass(self[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, options));
        _run(self[i]);
      } else {
        ret = self[i].switchClass[options].apply(self[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.switchClass.defaultOptions = {
    // Event type
    eventType: 'click',

    // Remove existing classes
    // Set this to false if you do not need to stack multiple instances
    removeExisting: false,

    // Бывает необходимо инициализировать плагин на динамически добавленном элемента.
    // Чтобы повесить на этот элемент событие, нужно добавить его через совойство selector
    // Example:
    // $('.parents-element').switchClass({
    //     selector : '.box a.opener:visible'
    // });
    selector: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    addEl: null,

    // Дополнительный элемент, которым можно УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    removeEl: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    toggleEl: null,

    // Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
    // Example 1: $('html, .popup-js, .overlay-js')
    // Example 2: $('html').add('.popup-js').add('.overlay-js')
    switchClassTo: null,

    // Удалать класс по клику по пустому месту на странице?
    // Если по клику на определенный элемент удалять класс не нужно,
    // то на этот элемент нужно добавить класс ".swc-prevent-remove" или дата-атрибудт "data-swc-prevent-remove",
    // или класс указанный в параметре "preventRemoveClass"
    // Example: true or false
    removeOutsideClick: true,

    // Удалять класс по клику на клавишу Esc?
    // Example: true or false
    removeEscClick: true,

    // Добавлять на html дополнительный класс 'css-scroll-fixed'?
    // Через этот класс можно фиксировать скролл методами css
    // _mixins.sass, scroll-blocked()
    // Example: true or false
    cssScrollFixed: false,

    // Если кликнуть по элементу с этим классом, то событие удаления активного класса не будет вызвано.
    // По умолчанию можно использовать класс ".swc-prevent-remove" или дата-атрибудт "data-swc-prevent-remove".
    // Example: class = "some-class"
    preventRemoveClass: null,

    // Классы-модификаторы
    modifiers: {
      initClass: null,
      activeClass: 'active'
    }
  };

})(jQuery);


/**
 * !Toggle menu
 */
function toggleMenu() {
  // Toggle Additional menu
  var $toggleMenu = $('.menu-opener-js');
  if ($toggleMenu.length) {
    $toggleMenu.switchClass({
      switchClassTo: $('.menu-js'),
      removeExisting: true,
      removeEl: $('.menu-close-js'),
      modifiers: {
        activeClass: 'menu_open'
      }
    });
  }

  // Toggle Mobile menu
  var $mobMenu = $('.mob-menu-opener-js');
  if ($mobMenu.length) {
    $mobMenu.switchClass({
      switchClassTo: $('.mob-menu-js').add('.mob-menu-overlay-js'),
      removeExisting: true,
      cssScrollFixed: true,
      removeEl: $('.menu-close-js'),
      modifiers: {
        activeClass: 'menu_open'
      },
      beforeAdd: function () {
        var $btnFilters = $('.btn-filters-opener-js');
        if ($btnFilters.length && $btnFilters.hasClass('active')) {
          $btnFilters.trigger('click');
        }
      }
    });
  }
}


/**
 * !Filters
 */
(function (window, document, $, undefined) {
  /*'use strict';*/

  // External js
  // ====================================================
  // 1) resizeByWidth;
  // 2) Isotope;

  // Inner Plugin Classes and Modifiers
  // ====================================================
  var PREF = 'productsFilters';
  var CONST_CLASSES = {
    scrollFixedClass: 'css-scroll-fixed',
    initClass: PREF + '_initialized',
    element: PREF,
  };

  var ProductsFilters = function (element, config) {
    var self,
        $window = $(window),
        $body = $('body'),
        $element = $(element),
        $productsContainer = $(config.productsContainer),
        $filter = $(config.filter),
        $filtersGroup = $(config.filtersGroup),
        $resultsPanel = $(config.resultsPanel),
        $resetFiltersEl = $(config.resetFilters),
        $moreFiltersContainer = $(config.moreFiltersContainer),
        $moreFiltersOpenEl = $(config.moreFiltersOpenEl),
        $moreFiltersDrop = $(config.moreFiltersDrop),
        filtersDropIsShow = false,
        $filtersCounter = $(config.filtersCounter),
        $filtersSearchInput = $(config.filtersSearchInput),
        $mobFiltersMenuOpenEl = $(config.mobFiltersMenuOpenEl),
        $mobFiltersMenuCloseEl = $(config.mobFiltersMenuCloseEl),
        tplFiltersNotFound = $(config.tplFiltersNotFound),
        $grid,
        lengthFilteredItems = 0,
        tagsOR = {},
        tagsAND = {};

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('productsFilters.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        gridInit = function () {
          $grid = $productsContainer.isotope({
            itemSelector: config.productElement,
            layoutMode: 'fitRows',
            percentPosition: true
          });
        },
        isEmptyObject = function (obj) {
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              return false;
            }
          }
          return true;
        },
        createFilterSelector = function () {
          // Create selector for isotope filtering.
          // Example return '.prop1.prop2' or '.prop1, .prop2' or '.prop1.prop3, .prop2.prop3';

          var arr = [];

          if (isEmptyObject(tagsOR)) {
            return concatValues(tagsAND);
          } else {
            for (var keyOr in tagsOR) {
              var propOr = tagsOR[keyOr];

              if (!isEmptyObject(tagsAND)) {
                var propAnd;
                for (var keyAnd in tagsAND) {
                  propAnd = propOr += tagsAND[keyAnd];
                }
                arr.push(propAnd);
              } else {
                arr.push(propOr);
              }
            }

            return arr.join(', ');
          }
        },
        concatValues = function (obj) {
          // Concatenation values of tags END.
          // Example return '.prop1.prop2'.
          // Show items which contains prop1 and prop2.

          var value = '',
              key;

          for (key in obj) {
            value += obj[key];
          }

          return value;
        },
        countActiveFilters = function () {
          return $filter.filter(':checked').length;
        },
        countActiveFiltersByGroup = function () {
          var objectGroup = {};
          $.each($filtersGroup, function () {
            var $curFGroup = $(this);
            objectGroup[$curFGroup.attr('data-filters-group')] = $(config.filter, $curFGroup).filter(':checked').length;
          });
          return objectGroup;
        },
        getFiltersSearchValue = function () {
          return $filtersSearchInput.val();
        },
        filtersIsActive = function () {
          return !!countActiveFilters() || getFiltersSearchValue() !== '';
        },
        btnResetChangeState = function() {
          $resetFiltersEl.toggleClass('disabled', !filtersIsActive()).prop('disabled', !filtersIsActive());
        },
        toggleFiltersResultsPanel = function () {
          $resultsPanel.toggleClass('filters-results-panel_' + config.modifiers.activeClass, filtersDropIsShow && filtersIsActive());
        },
        showMoreFilters = function () {
          $moreFiltersOpenEl.addClass(config.modifiers.showMoreFilters);
          $moreFiltersDrop.addClass(config.modifiers.showMoreFilters);
          $moreFiltersContainer.addClass(config.modifiers.showMoreFilters);
          filtersDropIsShow = true;

          $('html').addClass(CONST_CLASSES.scrollFixedClass);

          $element.trigger('productsFilters.afterMoreFiltersShow');

          toggleFiltersResultsPanel();
        },
        hideMoreFilters = function () {
          $moreFiltersOpenEl.removeClass(config.modifiers.showMoreFilters);
          $moreFiltersDrop.removeClass(config.modifiers.showMoreFilters);
          $moreFiltersContainer.removeClass(config.modifiers.showMoreFilters);
          filtersDropIsShow = false;

          $('html').removeClass(CONST_CLASSES.scrollFixedClass);

          $element.trigger('productsFilters.afterMoreFiltersHide');

          toggleFiltersResultsPanel();
        },
        clearFilters = function () {
          $filter.filter(':checked').prop('checked', false);
          tagsOR = {};
          tagsAND = {};
          $filtersSearchInput.val('');
          $grid.isotope({filter: '*'});

          btnResetChangeState();
          hideMoreFilters();
        },
        showMobFiltersMenu = function (){
          $mobFiltersMenuOpenEl.add($element).addClass(config.modifiers.activeClass);
          $resultsPanel.addClass('filters-results-panel_' + config.modifiers.activeClass + '-mob');

          $('html').addClass(CONST_CLASSES.scrollFixedClass);
        },
        hideMobFiltersMenu = function (){
          $mobFiltersMenuOpenEl.add($element).removeClass(config.modifiers.activeClass);
          $resultsPanel.removeClass('filters-results-panel_' + config.modifiers.activeClass + '-mob');

          $('html').removeClass(CONST_CLASSES.scrollFixedClass);
        },
        common = function () {
          // Фильтрация продуктов по клику на фильтр
          $element.on('change', config.filter, function (event) {
            event.preventDefault();

            var $curF = $(this);
            var $curFGroup = $curF.closest($filtersGroup);

            var curFGroupName = $curFGroup.attr('data-filters-group');
            var curFMethod = $curF.attr('data-filter-method');

            if (curFMethod !== 'or' && curFMethod !== 'and') {
              console.info('%c Warning! Filters method not specified. Add attribute "data-filter-method" ', 'background: #bd0000; color: white');
            }

            var curFGroupType = $curFGroup.attr('data-filters-type');

            if (curFGroupType === 'switchers' && $curF.prop('checked')) {
              $curFGroup.find(config.filter).not($curF).filter(':checked').prop('checked', false).trigger('change');
            }

            var curFTag = $curF.attr('data-filter');
            var tagsKey = curFTag.substr(1);

            if (curFMethod === 'or') {
              if ($curF.prop('checked')) {
                tagsOR[tagsKey] = curFTag;
              } else {
                delete tagsOR[tagsKey];
              }
            }

            if (curFMethod === 'and') {
              if ($curF.prop('checked')) {
                tagsAND[tagsKey] = curFTag;
              } else {
                delete tagsAND[tagsKey];
              }
            }

            var filterSelector = createFilterSelector();
            $grid.isotope({filter: filterSelector});

            $curF.toggleClass('filter_' + config.modifiers.activeFilter, $curF.prop('checked'));
            $curF.closest(config.filterItem).toggleClass('filter-item_' + config.modifiers.activeFilter, $curF.prop('checked'));

            btnResetChangeState();

            toggleFiltersResultsPanel();

            $element.trigger('productsFilters.afterFilterChange', {
              countActiveFilters: countActiveFilters(),
              countActiveFiltersByGroup: countActiveFiltersByGroup(),
              currentFilter: {
                isActive: $curF.prop('checked'),
                el: $curF,
                group: curFGroupName,
                method: curFMethod,
                tag: curFTag,
              },
              filtersDropShow: filtersDropIsShow,
              filterSelector: filterSelector,
              filtersIsActive: filtersIsActive(),
              tagsAndObj: tagsAND,
              tagsOrObj: tagsOR
            });
          });

          // Фильтрация продуктов по введенному тексту
          $filtersSearchInput.on('change keyup', function () {
            var text = $(this).val();

            $grid.isotope({
              filter: function () {
                var name = $(this).find(config.filtersSearchSelector).text();
                return name.match(new RegExp('(' + text + ')', 'gi'));
              }
            });

            btnResetChangeState();
            toggleFiltersResultsPanel();
          });

          // Открыть дополнительный список фильтров по клику на селектор
          $moreFiltersOpenEl.on('click', function () {
            if (filtersDropIsShow) {
              hideMoreFilters();
            } else {
              showMoreFilters();
            }

            return false;
          });

          // Показать результаты
          $body.on('click', config.showResultsEl, function (e) {
            e.preventDefault();

            hideMobFiltersMenu();
            hideMoreFilters();

            $('html, body').stop().animate({scrollTop: 0}, 300);
          });

          // Счетчик отфильтрованных товаров
          $grid.on('layoutComplete', function (event, filteredItems) {
            lengthFilteredItems = filteredItems.length;

            var filterCounterContent = 'Items not found';

            // search counter
            if (lengthFilteredItems > 0) {
              var items = (filteredItems.length > 1) ? 'items' : 'item';
              filterCounterContent = 'Found <span style="display: inline-block;"><strong>' + lengthFilteredItems + '</strong> ' + items + '</span>';
            }

            $filtersCounter
                .html(filterCounterContent)
                .closest('.filters-button')
                .toggleClass('btn-show', filtersIsActive());

            // "no product" show / hide
            if (!lengthFilteredItems) {
              $filtersCounter.closest('.filters-button').addClass('no-items');
              tplFiltersNotFound.show();
            } else {
              $filtersCounter.closest('.filters-button').removeClass('no-items');
              tplFiltersNotFound.hide();
            }

            $element.trigger('productsFilters.afterFiltered', {
              countActiveFilters: countActiveFilters(),
              countActiveFiltersByGroup: countActiveFiltersByGroup(),
              filtersDropShow: filtersDropIsShow,
              filtersIsActive: filtersIsActive(),
              filteredItems: filteredItems,
              lengthFilteredItems: lengthFilteredItems,
              tagsAndObj: tagsAND,
              tagsOrObj: tagsOR
            });
          });

          // Очистить фильтры и поле поиска
          $resetFiltersEl.on('click', function (e) {
            e.preventDefault();
            clearFilters();
            btnResetChangeState();
          });

          // Открыть панель фильтров (на мобиле)
          $body.on('click', config.mobFiltersMenuOpenEl, function (event) {
            var $curBtn = $(this);

            if (!$curBtn.hasClass(config.modifiers.activeClass)) {
              showMobFiltersMenu();
            } else {
              hideMobFiltersMenu();
            }

            event.preventDefault();
          });

          // Закрыть панель фильтров на мобиле
          $body.on('click', config.mobFiltersMenuCloseEl, function (event) {
            hideMobFiltersMenu();

            event.preventDefault();
          });

          // Закрывать панель фильтров (мобильный вид) при ресайзе
          $window.on('resizeByWidth', function () {
            if (window.innerWidth >= config.breakpoints) {
              hideMobFiltersMenu();
            }
          });
        },
        init = function () {
          // Триггер change на активных фильтрах
          $filter.filter(':checked').trigger('change');
          // Добавтить сообщение об отсутствии товаров.
          // Скрыть его.
          tplFiltersNotFound.hide().insertAfter($productsContainer);

          $element.addClass(CONST_CLASSES.initClass);
          $element.trigger('productsFilters.afterInit');
        };

    self = {
      callbacks: callbacks,
      gridInit: gridInit,
      clearFilters: clearFilters,
      showMoreFilters: showMoreFilters,
      hideMoreFilters: hideMoreFilters,
      showMobFiltersMenu: showMobFiltersMenu,
      hideMobFiltersMenu: hideMobFiltersMenu,
      common: common,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.productsFilters.callbacks();
    el.productsFilters.gridInit();
    el.productsFilters.common();
    el.productsFilters.init();
  }

  $.fn.productsFilters = function () {
    var self = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        if (self[i].productsFilters) {
          console.info("%c Warning! Plugin already has initialized! ", 'background: #bd0000; color: white');
          return;
        }

        self[i].productsFilters = new ProductsFilters(self[i], $.extend(true, {}, $.fn.productsFilters.defaultOptions, opt));

        _run(self[i]);
      } else {
        ret = self[i].productsFilters[opt].apply(self[i].productsFilters, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.productsFilters.defaultOptions = {
    // Контейнер фильтруемых продуктов
    productsContainer: '.filtered-elements-js',
    // Продукт
    productElement: '.products__item',
    // Фильтр
    filter: '.filter-js',
    // Елемент содержащий фильтр
    filterItem: '.filter-item-js',
    // Группа фильтров одного типа
    filtersGroup: '[data-filters-group]',
    
    // Кнопка открытия панели фильтров (мобильный вид)
    mobFiltersMenuOpenEl: '.btn-filters-opener-js',
    // Кнопка закрытия панели фильтров (мобильный вид)
    mobFiltersMenuCloseEl: '.btn-filters-close-js',
    
    // Поле поиска
    filtersSearchInput: $('.filters-search-js'),
    // Селектор, по которому ведется поиск
    filtersSearchSelector: '.products__content',
    
    // Общий контейнер содержащий кнопку открытия списка фильтров и список дополнительных фильтров
    moreFiltersContainer: '.filters-content-js',
    // Кнопка открытия списка дополнительных фильтров
    moreFiltersOpenEl: '.filter-selector-js',
    // Список дополнительных фильтров
    moreFiltersDrop: '.filters-drop-js',
    // Елемент со счетчиком отфильтрованных товаров
    filtersCounter: '.filters-counter-js',

    // Панель с результатами поиска
    resultsPanel: '.filters-results-panel-js',
    // Кнопка сброса фильтров
    resetFilters: '.clear-filters-js',
    // Кнопка показа фильтров
    showResultsEl: '.show-filter-items-js',

    // Темплейт уведомления о ненайденных продуктах
    tplFiltersNotFound: '<div class="filters-not-found">Items not found</div>',

    breakpoints: 768,
    animationSpeed: 200,
    modifiers: {
      activeClass: 'active',
      showMoreFilters: 'show-drop',
      activeFilter: 'active'
    },

    // events
    afterFiltered: function(event, filters, obj){},
  };

})(window, document, jQuery);

function filtersEvents() {
  var $filters = $('.filters-js');
  var animationSpeed = 200;

  if ($filters.length) {
    $filters.on('productsFilters.afterInit', function () {
      // Hide preloader
      setTimeout(function () {
        $('.page-preloader').addClass('hide');
        $HTML.addClass('overflow-visible');
      }, animationSpeed + 100)
    });

    $filters.productsFilters({
      animationSpeed: animationSpeed,
      afterFiltered: function (event, filters, obj) {
        $('.btn-show-items').toggleClass('active', obj.filtersIsActive);

        setTimeout(function () {
          $('.products__figure img').trigger("unveil");
        }, 50);

        var $doc = $('html, body');

        $doc.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
          $doc.stop();
        });

        $doc.animate({ scrollTop: 0 }, 300, function(){
          $doc.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
        });
      },
      afterMoreFiltersShow: function () {
        $('.mob-menu-opener-js').switchClass('remove');
      }
    });
  } else {
    // Hide preloader
    $('.page-preloader').addClass('hide');
    $HTML.addClass('overflow-visible');
  }
}


function showFilterByHash() {
  var breakpoints = 768;

  // Открыть панель фильтров на МОБИЛЕ, если в url хэш #filters-open
  if (document.location.hash === "#filters-open" && window.innerWidth < breakpoints) {
    setTimeout(function () {
      $('.filters-js').productsFilters('showMobFiltersMenu');
    }, 200);
  }

  // Открыть панель фильтров на планшете и десктопе в url хэш #filters-open
  if (document.location.hash === "#filters-open" && window.innerWidth >= breakpoints) {
    setTimeout(function () {
      $('.filters-js').productsFilters('showMoreFilters');
    }, 200);
  }
}


function hideMobFiltersMenuTrigger() {
  $('.search-form__submit-js').on('click', function (event) {
    $('.filters-js').productsFilters('hideMobFiltersMenu');
    if ($(this).closest('.search-form-js').find('.search-form__input-js').val().length) {
      $.switchClass.remove(true);
    }
    event.preventDefault();
  })
}


/**
 * !Share Events
 */
function shareEvents() {
  var $btn = $('.open-share-js');
  $btn.each(function () {
    var $currentBtn = $(this),
        $wrapper = $currentBtn.parent(),
        $itemList = $wrapper.find('.soc-square'),
        $item = $wrapper.find('.soc-square li');

    var tw = new TimelineLite({paused: true});

    tw
        .set($itemList, {perspective: 500})
        .set($item, {display: "block"})
        .staggerFrom($item, 0.2, {autoAlpha: 0, rotationX: -90, transformOrigin: "50% 0"}, 0.1);

    $currentBtn
        .on('click', function (e) {
          e.preventDefault();
        });

    if (DESKTOP) {
      $wrapper.on('mouseenter', function () {
        tw.play();
      }).on('mouseleave', function () {
        tw.reverse();
      });
    } else {
      $wrapper.on('click', function () {
        if (tw.progress() !== 0) {
          tw.reverse();

          return false;
        }
        tw.play();
      });
    }
  });
}


/**
 * !Share Fixed
 */
function shareFixed() {
  var $fixedBox = $('.soc-js');

  if (!$fixedBox.length) return false;

  var fixedBoxTopPosition = $fixedBox.offset().top,
      $barrier = $('.full-width-js'),
      $bottom = $('.footer'),
      topSpace = 50;

  $WINDOW.on('load scroll resizeByWidth', function () {

    var barrierTopPosition = $barrier.offset().top,
        barrierHeight = $barrier.outerHeight(),
        fixedBoxHeight = $fixedBox.outerHeight(),
        bottomTopPosition = $bottom.offset().top,
        currentScrollTop = $WINDOW.scrollTop(),
        intend = $('.header').innerHeight();

    if (currentScrollTop >= (fixedBoxTopPosition - topSpace)) {
      $fixedBox
          .addClass('fixed')
          .css({
            'position': 'fixed',
            'top': topSpace + intend
          });
    } else {
      $fixedBox
          .removeClass('fixed')
          .css({
            'position': 'relative',
            'top': 'auto'
          });
    }

    if (currentScrollTop >= barrierTopPosition - fixedBoxHeight - topSpace * 2 && currentScrollTop < barrierTopPosition + barrierHeight || currentScrollTop >= bottomTopPosition - fixedBoxHeight - topSpace * 2) {
      var tl = TweenMax.to($fixedBox, 0.1, {autoAlpha: 0, ease: Power2.easeInOut});
    } else {
      TweenMax.to($fixedBox, 0.1, {autoAlpha: 1, ease: Power2.easeInOut});
    }
  });
}


/**
 * !Toggle hover class
 */
(function ($) {
  // external js:
  // 1) device.js 0.2.7 (widgets.js);
  // 2) debouncedresize (widgets.js);

  var HoverClass = function (settings) {
    var options = $.extend({
      container: 'ul',
      item: 'li',
      drop: 'ul'
    }, settings || {});

    var self = this,
        container = $(options.container);

    self.options = options;
    self.$container = container;
    self.$item = $(options.item, container);
    self.$drop = $(options.drop, container);
    self.desktop = device.desktop();

    self.modifiers = {
      hover: 'hover'
    };

    self.addClassHover();

    if (!self.desktop) {
      $WINDOW.on('debouncedresize', function () {
        self.removeClassHover();
      });
    }
  };

  HoverClass.prototype.addClassHover = function () {
    var self = this,
        $container = self.$container,
        item = self.options.item,
        $item = self.$item,
        $drop = self.$drop,
        _hover = this.modifiers.hover;

    $container.on('click', '' + item + '', function (e) {

      if (self.desktop || $WINDOW.width() < 980) return;

      var $currentItem = $(this);

      if (!$currentItem.has($drop).length) {
        return;
      }

      if ($currentItem.hasClass(_hover)) {
        $currentItem
            .removeClass(_hover)
            .find('.' + _hover + '')
            .removeClass(_hover);

        return;
      }

      $item.removeClass(_hover);
      $currentItem.addClass(_hover);

      return false;
    });

    $drop.children().not('.close-nav-drop-js').on('click', function (e) {
      if (self.desktop || $WINDOW.width() < 980) return;

      e.stopPropagation();
    });

    $DOC.on('click', function () {
      if (self.desktop || $WINDOW.width() < 980) return;

      $item.removeClass(_hover);
    });

    if (self.desktop) {
      $container.on('mouseenter', '' + item + '', function () {
        var currentItem = $(this);

        if (currentItem.prop('hoverTimeout')) {
          currentItem.prop('hoverTimeout',
              clearTimeout(currentItem.prop('hoverTimeout')
              )
          );
        }

        currentItem.prop('hoverIntent', setTimeout(function () {
          currentItem.addClass(_hover);
        }, 50));

      });
      $container.on('mouseleave', '' + item + '', function () {
        var currentItem = $(this);

        if (currentItem.prop('hoverIntent')) {
          currentItem.prop('hoverIntent',
              clearTimeout(currentItem.prop('hoverIntent')
              )
          );
        }

        currentItem.prop('hoverTimeout', setTimeout(function () {
          currentItem.removeClass(_hover);
        }, 100));
      });
    }
  };

  HoverClass.prototype.removeClassHover = function () {
    var self = this;
    self.$item.removeClass(self.modifiers.hover);
  };

  window.HoverClass = HoverClass;

}(jQuery));

function hoverClassInit() {
  var $navList = $('.nav-list');
  if ($navList.length) {
    new HoverClass({
      container: $navList,
      drop: '.js-nav-drop'
    });
  }
}


/**
 * !Map
 */
var largePinMap = 'img/map-pin.png';

var localObjects = [
  [
    {lat: 32.9122, lng: -96.7391}, //coordinates of marker
    {latBias: 0.0020, lngBias: 0}, //bias coordinates for center map
    largePinMap, //image pin
    15,
    {
      title: 'USA & Canada',
      address: '<b>Address:</b> <div>9330 LBJ Freeway, Suite 900 <br> Dallas, TX 75243 <br> PO Box 647, LIghtfoot, VA 23090</div>',
      phone: '<b>Tel.:</b> <div><a href="tel:2145613922">(214) 561-3922</a></div>',
      works: '<b>E-mail:</b> <div><a href="mailto:info@aztoys.com">info@aztoys.com</a></div>'
    }
  ], [
    {lat: 59.4384, lng: 24.7340}, //coordinates of marker
    {latBias: 0.0020, lngBias: 0}, //bias coordinates for center map
    largePinMap, //image pin
    15,
    {
      title: 'Europe',
      address: '<b>Address:</b> <div>Toompuiestee 35, korrus 2, <br> Tallinn 10133, Estonia</div>',
      phone: '<b>Tel.:</b> <div><a href="tel:003725183088"></div>',
      works: '<b>E-mail:</b> <div><a href="mailto:info@aztoys.com">info@aztoys.com</a></div>'
    }
  ]
];

var styleMap = [
  {"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"color": "#f7f1df"}]}, {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [{"color": "#d0e3b4"}]
  }, {"featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{"visibility": "off"}]}, {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
  }, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.medical", "elementType": "geometry", "stylers": [{"color": "#fbd3da"}]}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{"color": "#bde6ab"}]
  }, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "labels"}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#ffe15f"}]
  }, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#efd151"}]}, {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#fff"}]
  }, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"}]}, {
    "featureType": "transit.station.airport",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#cfb2db"}]
  }, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"}]}
];

function mapMainInit() {
  if (!$('[id*="-map"]').length) {
    return;
  }

  function mapCenter(index) {
    var localObject = localObjects[index];

    return {
      lat: localObject[0].lat + localObject[1].latBias,
      lng: localObject[0].lng + localObject[1].lngBias
    };
  }

  var mapOptions = {};

  var markers = [],
      elementById = [
        document.getElementById('local-01-map'),
        document.getElementById('local-02-map')
      ];

  if ($(elementById[0]).length) {
    mapOptions = {
      zoom: 15,
      center: mapCenter(0),
      styles: styleMap,
      mapTypeControl: false,
      scaleControl: false,
      scrollwheel: false
    };

    var map0 = new google.maps.Map(elementById[0], mapOptions);
    addMarker(0, map0);

    /*aligned after resize*/
    var resizeTimer0;
    $WINDOW.on('resize', function () {
      clearTimeout(resizeTimer0);
      resizeTimer0 = setTimeout(function () {
        moveToLocation(0, map0);
      }, 500);
    });
  }

  if ($(elementById[1]).length) {
    mapOptions = {
      zoom: 15,
      center: mapCenter(1),
      styles: styleMap,
      mapTypeControl: false,
      scaleControl: false,
      scrollwheel: false
    };

    var map1 = new google.maps.Map(elementById[1], mapOptions);
    addMarker(1, map1);

    /*aligned after resize*/
    var resizeTimer1;
    $WINDOW.on('resize', function () {
      clearTimeout(resizeTimer1);
      resizeTimer1 = setTimeout(function () {
        moveToLocation(1, map1);
      }, 500);
    });
  }

  /*move to location*/
  function moveToLocation(index, map) {
    var object = localObjects[index];
    var center = new google.maps.LatLng(mapCenter(index));
    map.panTo(center);
    map.setZoom(object[3]);
  }

  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 220
  });

  function addMarker(index, map) {
    var object = localObjects[index];

    var marker = new google.maps.Marker({
      position: object[0],
      //animation: google.maps.Animation.DROP,
      map: map,
      icon: object[2],
      title: object[4].title
    });

    markers.push(marker);

    function onMarkerClick() {
      var marker = this;

      infoWindow.setContent(
          '<div class="map-popup">' +
          '<h4>' + object[4].title + '</h4>' +
          '<div class="map-popup__list">' +
          '<div class="map-popup__row">' + object[4].address + '</div>' +
          '<div class="map-popup__row">' + object[4].phone + '</div>' +
          '<div class="map-popup__row">' + object[4].works + '</div>' +
          '</div>' +
          '</div>'
      );

      infoWindow.close();

      infoWindow.open(map, marker);
    }

    map.addListener('click', function () {
      infoWindow.close();
    });

    marker.addListener('click', onMarkerClick);
  }
}


/**
 * !Contacts
 */
function contacts() {
  'use strict';

  var $locate = $('.locate-js');
  if (!$locate.length) return false;

  var activeClass = 'active',
      hideClass = 'hide',
      tabEvent = true,
      index = 0;

  var $tab = [
    '.locate-bg-js',
    '.locate-adr-js',
    '.locate-cont-js'
  ];

  var $map = $('.local-map-js');

  $('.locate-controls-js').on('click', 'a', function (e) {
    e.preventDefault();

    var $currentBtn = $(this);

    if ($currentBtn.hasClass(activeClass)) return false;

    var $currentWrapper = $currentBtn.closest($locate);
    index = $currentBtn.index();

    $('.locate-controls-js a').removeClass(activeClass);
    $currentBtn.addClass(activeClass);

    if (tabEvent) {
      switchStateTab($currentWrapper, $tab);
      switchStateTab($currentWrapper, $tab, index);
    }

    if (!tabEvent) {
      switchStateTab($currentWrapper, $map);
      switchStateTab($currentWrapper, $map, index);
    }

    return index;
  });

  $('.see-map-js').on('click', function (e) {
    e.preventDefault();

    var $currentBtn = $(this),
        $currentWrapper = $currentBtn.closest('.locate-js');

    $currentBtn.toggleClass(activeClass, tabEvent);
    $currentWrapper.toggleClass('map-show', tabEvent);
    $currentWrapper.find('.locate-tabs-js').toggleClass(hideClass, tabEvent);

    if (!tabEvent) {
      tabEvent = true;

      switchStateTab($currentWrapper, $tab, index);
      switchStateTab($currentWrapper, $map);

    } else {
      tabEvent = false;

      switchStateTab($currentWrapper, $tab);
      switchStateTab($currentWrapper, $map, index);
    }
  });

  function switchStateTab(content, tab, index) {
    // if property "index" length class added
    // else class removed
    if (Array.isArray(tab)) {
      for (var i = 0; i < tab.length; i++) {
        if (index !== undefined) {
          content.find(tab[i]).eq(index).addClass(activeClass);
        } else {
          content.find(tab[i]).removeClass(activeClass);
        }
      }
    } else {
      if (index !== undefined) {
        content.find(tab).eq(index).addClass(activeClass);
      } else {
        content.find(tab).removeClass(activeClass);
      }
    }
  }
}


/**
 * !Swiper slider initial
 */
function videoSliderInit() {
  var $videoSlider = $('.video-slider-js'),
      $btnPrev = $('.swiper-button-prev'),
      $btnNext = $('.swiper-button-next');

  if ($videoSlider.length) {
    var classVideoPlayed = 'video-played',
        animateSpeed = 0.3;

    $videoSlider.each(function () {
      var $curSlider = $(this),
          $pagination = $curSlider.find('.swiper-pagination'),
          $navPrev = $curSlider.find($btnPrev),
          $navNext = $curSlider.find($btnNext);

      var thisSlider = new Swiper($curSlider, {
        init: false,
        spaceBetween: 10,
        // slidesPerView: 3,
        slidesPerView: 'auto',
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 10,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        },
        centeredSlides: true,
        loop: true,
        loopedSlides: 5,
        shortSwipes: false,
        slideToClickedSlide: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        parallax: true,
        navigation: {
          nextEl: $navNext,
          prevEl: $navPrev,
        },
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        on: {
          slideChange: function () {
            closeSwiperVideo();
          }
        },
      });

      thisSlider.on('init', function () {
        $curSlider.addClass('is-loaded');

        var $iframe = $('<iframe src="about:blank" frameborder="0" allowfullscreen></iframe>');
        TweenMax.set($iframe, {autoAlpha: 0});

        $iframe
            .addClass('swiper-video')
            .css({
              'width': '100%',
              'height': '100%'
            })
            .prependTo($(thisSlider.slides).find('.video-slider-el'));
      });

      thisSlider.init();
    });

    // Управление видео
    $videoSlider.on('click', '.play-video-js', function (e) {
      e.preventDefault();

      playSwiperVideo.call(this);
    }).on('click', '.close-video-js', function (e) {
      e.preventDefault();

      closeSwiperVideo();
    });
  }

  /* Add video to each slide */
  function playSwiperVideo() {
    var $playBtn = $(this),
        $container = $playBtn.closest($('.swiper-slide'));

    $container.addClass(classVideoPlayed);

    $playBtn.hide(0);
    $container.find($('.swiper-img-js')).hide(0);
    $container.find($('.swipe-title-js')).hide(0);
    $playBtn.closest($videoSlider).find($btnPrev).hide(0);
    $playBtn.closest($videoSlider).find($btnNext).hide(0);


    var $iframe = $container.find('iframe');
    var src = $playBtn.attr('href');

    $iframe.attr("src", src + '?rel=0&autoplay=1');
    TweenMax.to($iframe, animateSpeed, {autoAlpha: 1});

    $container.find('.close-video-js').show(0);
  }

  function closeSwiperVideo() {

    var $content = $('.video-played');

    $content.find('.close-video-js').hide(0);
    $content.find($('.swiper-img-js')).show(0);
    $content.find($('.swipe-title-js')).show(0);
    $content.find('.play-video-js').show(0);
    $btnPrev.add($btnNext).show(0);


    var $iframe = $content.find('iframe');

    $iframe.attr("src", 'about:blank');
    TweenMax.to($iframe, animateSpeed, {autoAlpha: 0});

    $content.removeClass(classVideoPlayed);
  }
}


/**
 * !Promo slider initial
 */
function promoSliderInit() {
  var $promoSlider = $('.promo-slider-js');

  if ($promoSlider.length) {
    $promoSlider.each(function () {
      var $thisSlider = $(this),
          $pagination = $thisSlider.find('.swiper-pagination'),
          $navPrev = $thisSlider.find('.swiper-button-prev'),
          $navNext = $thisSlider.find('.swiper-button-next');

      var curSlider = new Swiper($thisSlider, {
        init: false,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 10,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 5000
        },
        watchSlidesVisibility: true,
        navigation: {
          nextEl: $navNext,
          prevEl: $navPrev,
        },
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        }
      });

      curSlider.on('init', function () {
        $thisSlider.addClass('is-loaded');
      });

      curSlider.init();
    });
  }
}


/**
 * !Navigation slider
 */
function navSlider() {
  var $navSlider = $('.nav-slider-js');

  if ($navSlider.length) {
    $navSlider.each(function () {
      var $thisSlider = $(this);
      var $activeSlide = $thisSlider.find('.swiper-slide.current');
      var initSlide = $activeSlide.length ? $activeSlide.index() : 0;

      var curSlider = new Swiper($thisSlider, {
        init: false,
        autoHeight: true,
        initialSlide: initSlide,
        simulateTouch: false,
        followFinger: false,
        allowTouchMove: false,
        // effect: 'coverflow',
        coverflowEffect: {
          rotate: 10,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        loop: false,
        watchSlidesVisibility: true,
        parallax: true,
        on: {
          slideChangeTransitionEnd: function () {
            $thisSlider.closest('.mCustomScrollbar').mCustomScrollbar("update");
          }
        }
      });

      curSlider.on('init', function () {
        $thisSlider.addClass('is-loaded');
        setTimeout(function () {
          $thisSlider.closest('.mCustomScrollbar').mCustomScrollbar("update");
        }, 50)
      });

      curSlider.init();

      $thisSlider.on('click', 'a[href^="#"]', function (event) {
        var $curLink = $(this);
        curSlider.slideTo($($curLink.attr('href')).index());
        event.preventDefault();
      });

      var currentGroup = getQueryVariable('current-group');

      switch ($.trim(currentGroup)) {
        case 'products':
          curSlider.slideTo(1);
          break;

        case 'brands':
          curSlider.slideTo(2);
          break;
      }
    });
  }
}


/**
 * !Fotorama init
 */
function fotoramaInit() {
  var $gallery = $('.gallery-js');

  $.each($gallery, function () {
    var $this = $(this);

    var $galleryFotorama = $this.fotorama({
      click: false,
      nav: 'thumbs',
      allowfullscreen: true,
      thumbmargin: 20,
      thumbwidth: 82,
      thumbheight: 82,
      thumbborderwidth: 2,
      ratio: 1 / 1
    });

    // Get the API object.
    var fotorama = $galleryFotorama.data('fotorama');

    // Inspect it in console.
    $this.on('click', '.fotorama__grab', function (e) {
      e.preventDefault();
      fotorama.requestFullScreen();
    });

    if (!DESKTOP) {
      fotorama.setOptions({
        arrows: 'always'
      });
    }
  });
}


/**
 * !Similar slider
 */
function tapeSlider(reload) {
  var $frame = $('.tape-slider__frame');
  var $wrap = $frame.parent();

  if ($frame.length > 0) {
    var options = {
      horizontal: 1,
      itemNav: 'basic',
      smart: 1,
      activateOn: 'click',
      mouseDragging: 1,
      touchDragging: 1,
      releaseSwing: 1,
      startAt: 0,
      scrollBar: $wrap.find('.tape-slider__scrollbar'),
      scrollBy: 0,
      speed: 300,
      elasticBounds: 1,
      easing: 'easeOutExpo',
      dragHandle: 1,
      dynamicHandle: 1,
      clickBar: 1,

      // Buttons
      prevPage: $wrap.find('.tape-slider__prev'),
      nextPage: $wrap.find('.tape-slider__next')
    };

    var frame = new Sly($frame, options);


    if (reload) {
      frame.reload();
    } else {
      frame.init();
    }

    // Reload on resize
    $WINDOW.on('resize', function () {
      frame.reload();
    });
  }
}


/**
 * !Popup events
 */
function popupEvents() {
  var $popup = $('.popup-js');

  if (!$popup.length) return false;

  var $popupOpener = $('.popup-opener-js'),
      $main = $('.main'),
      btnClose = '.btn-close-popup',
      $btnClose = $(btnClose),
      popupOpened = false,
      animateSpeed = 0.6,
      topPosition = 0;

  $popup.on('popupProdOpen', function () {
    openPopup();
  });

  $popup.on('popupProdClose', function () {
    closePopup();
  });

  // add overlay on page

  //var $popupOverlay = $('<div class="popup-overlay" />');
  //$popupOverlay.appendTo('body');

  // prepare popup
  TweenMax.set($popup, {
    autoAlpha: 0,
    height: '100%',
    // yPercent: 100,
    onComplete: function () {
      $popup.show(0, function () {
        fotoramaInit();
        if ($('.tape-slider__holder').length > 0) {
          tapeSlider();
        }
      });
    }
  });


  // __________________________________________мой костыль по открыванию страницы с попапом
  var $products = $('.products');
  if ($products.length) {
    imagesLoaded($products, function () {
      var show_pop = $('#show-popup').attr('data-card');

      if (show_pop) {

        openPopup();
      }

    });
  }

  // _________________________________________ конец костыля


  // switch popup
  $popupOpener.on('click', function (e) {
    e.preventDefault();
    if (!popupOpened) {

      if (false) {
        // _________________________________________________МОЙ КОД
        var item_url = $(this).attr('data-url');
        history.pushState({}, '', '/products/' + item_url + '/');
        fill_item_card_data(item_url);
        // ________________________________________________МОЙ КОД_КОНЕЦ
      }

      openPopup();
    } else {
      closePopup();
    }
  });

  // recalculation main height
  var $window = $WINDOW;
  $window.on('heightMainRecalc', function () {
    if (popupOpened) {
      var height = $popup.outerHeight() + $('.header').innerHeight();
      TweenMax.to($main, 0.2, {height: height}, 0.5);
    }
  });

  // recalculation main height on resize page width
  $window.on('resizeByWidth', function () {
    $window.trigger('heightMainRecalc');
  });

  // close popup on click to "Esc" key
  $DOC.keyup(function (e) {
    if (e.keyCode === 27) {
      closePopup();
    }
  });

  // close popup on click to close button
  $BODY.on('click', btnClose, function (e) {
    e.preventDefault();

    // МОЙ КОД
    if (false) {
      history.pushState({}, '', '/products/');
    }
    // МОЙ КОД_КОНЕЦ


    closePopup();
  });

  // popup open
  function openPopup() {
    topPosition = $WINDOW.scrollTop();

    $popup.height('auto');
    // show popup
    var height = $popup.outerHeight() + $('.header').innerHeight();
    TweenMax.set($main, {
      height: height,
      onComplete: function () {
        pageScrollToTop();

        TweenMax.to($popup, animateSpeed, {
          autoAlpha: 1,
          // yPercent: 0,
          ease: Power3.easeInOut,
          onComplete: function () {

            toggleBtnClose();

            popupOpened = true;

            toggleMainClass(popupOpened);

            $BODY.removeClass('product-is-card');
          }
        }, 0.1);
      }
    });

    // replaceTegSEO();
  }

  // popup close
  function closePopup() {
    toggleBtnClose(false);
    toggleMainClass(false);

    TweenMax.set($main, {
      height: 'auto', onComplete: function () {
        setTimeout(function () {
          pageScrollToItem(topPosition);
        }, 100);
      }
    });

    $popup.height('100%');
    TweenMax.to($popup, animateSpeed, {
      autoAlpha: 0,
      // yPercent: 100,
      ease: Power3.easeInOut,
      onComplete: function () {
        // enable page scrolling
        // toggleScrollPage('popup-events');
        //TweenMax.to($popupOverlay, animateSpeed, {
        //	autoAlpha: 0,
        //	yPercent: 0,
        //	ease: Back.easeOut.config(1),
        //	onComplete: function () {
        popupOpened = false;
        //	}
        //});
      }
    });

    // МОЙ КОД
    if (false) {
      history.pushState({}, '', '/products/');
    }
    // МОЙ КОД_КОНЕЦ

    // replaceTegSEO(false);
  }

  // hide close button
  TweenMax.set($btnClose, {autoAlpha: 0});

  // button close toggle
  var btnTween = new TimelineLite({paused: true});
  btnTween.to($btnClose, 0.2, {autoAlpha: 1});

  function toggleBtnClose() {
    var arg = arguments[0];
    if (arg === false) {
      btnTween.reverse();
    } else {
      btnTween.play();
    }
  }

  // page scroll to top
  function pageScrollToTop() {
    TweenMax.to(window, 0.1, {scrollTo: {y: 0}, ease: Power3.easeInOut});
  }

  // page scroll to item
  function pageScrollToItem() {
    topPosition = topPosition || 0;

    $('html,body').scrollTop(topPosition);
  }

  // hide filters opener and header
  function toggleMainClass(popupOpened) {
    $HTML.toggleClass('popup-show', popupOpened);
  }

  //replace tegs for SEO
  function replaceTegSEO() {
    var productTitle = $popup.find('.product-card__title');
    var classesProductTitle = productTitle.attr('class');
    var productTitleContent = productTitle.html();

    var pageTitle = $('.section-title').find('h1');
    var classesPageTitle = 'page-main-title';
    var pageTitleContent = pageTitle.html();

    if (arguments[0] === false) {
      productTitle.replaceWith('<div class="' + classesProductTitle + '">' + productTitleContent + '</div>');

      pageTitle = $('.page-main-title');
      pageTitleContent = pageTitle.html();

      pageTitle.replaceWith('<h1>' + pageTitleContent + '</h1>');
    } else {
      productTitle.replaceWith('<h1 class="' + classesProductTitle + '">' + productTitleContent + '</h1>');

      pageTitle.replaceWith('<div class="' + classesPageTitle + '">' + pageTitleContent + '</div>');
    }
  }
}


/**
 * Toggle scroll of page
 */
function toggleScrollPage(id) {
  // id is mandatory argument
  // if second arguments equal false
  // page fixed;
  if (id === undefined) return false;

  var $body = $BODY,
      $html = $HTML,
      attr = $html.attr('data-toggle-scroll');

  if (typeof attr !== typeof undefined && attr !== false && attr !== id) return false;

  $html.attr('data-toggle-scroll', id);

  var arg = arguments[1];
  if (arg === false) {
    // if (DESKTOP) {
    //   $body.mCustomScrollbar('disable');
    // } else {
    //   $html.addClass('css-scroll-fixed');
    // }
    $html.addClass('css-scroll-fixed');
  } else {
    // if (DESKTOP) {
    //   $body.mCustomScrollbar('update');
    // } else {
    //   $html.removeClass('css-scroll-fixed');
    // }
    $html.removeClass('css-scroll-fixed');

    $html.removeAttr('data-toggle-scroll');
  }
}


function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}


function imgLazyLoad() {
  if ($('.products__figure').length > 0) {
    $('.products__figure img').unveil();
  }
}

/** ready/load/resize document **/
$WINDOW.on('load', function () {
  var $pagePreloader = $('.page-preloader');
  if (document.location.hash !== "#filters-open") {
    setTimeout(function () {
      $pagePreloader.addClass('hide');
      $HTML.addClass('overflow-visible');
    }, 50);
  }
  popupEvents();
});

$DOC.ready(function () {
  /* Init custom scroll only no touch devices */
  if (DESKTOP) {
    customScroll();
  }
  if ($BODY.hasClass('home-page') && DESKTOP && window.innerWidth >= DESKTOP_WIDTH) {
    togglePromoOnScroll();
  }
  shareFixed();
  placeholderInit();
  stateFields();
  searchToggle();
  tabs();
  equalHeightInit();
  if (DESKTOP) {
    customSelect();
  }
  // filtersEvents();
  shareEvents();
  hoverClassInit();
  toggleMenu();
  mapMainInit();
  contacts();

  videoSliderInit();
  promoSliderInit();
  navSlider();

  imgLazyLoad();
});