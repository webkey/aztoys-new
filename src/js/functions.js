/*resize only width*/
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth != currentWidth;
  if(resizeByWidth){
    $(window).trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});
/*resize only width end*/

/*device detected*/
var DESKTOP = device.desktop();
//console.log('DESKTOP: ', DESKTOP);
var MOBILE = device.mobile();
//console.log('MOBILE: ', MOBILE);
var TABLET = device.tablet();
//console.log('MOBILE: ', MOBILE);
/*device detected end*/

/*placeholder */
function placeholderInit(){
  $('[placeholder]').placeholder();
}
/*placeholder end*/

/*custom scroll on page */
function pageCustomScroll() {
  // 1) malihu jquery custom scrollbar plugin (widgets.js);
  // 2) resizeByWidth (resize only width);
  // 3) TweetMax VERSION: 1.19.0 (widgets.js);

  if (!DESKTOP) return false;

  var $body = $('body'),
      minScrollTop = $('.header').outerHeight(),
      previousScrollTop = -1,
      $fixedBox = $('.soc-js');

  $(window).on("load",function(){

    if ( $('.about').length ) {
      aboutPage = true;
    }
    else {
      aboutPage = false;
    }

    var thisMCSTop = 0;
    // custom scroll on page
    $body.mCustomScrollbar({
      theme: "minimal-dark",
      autoHideScrollbar: true,
      autoExpandScrollbar: true,
      scrollInertia: 50,
      mouseWheel:{ scrollAmount: 100 },
      callbacks: {
        onInit: function () {

          thisMCSTop = -this.mcs.top;

          toggleHeaderForCustomScroll(thisMCSTop);

          // parallaxBg(thisMCSTop);

          if ($fixedBox.length) {
            shareFixedForCustomScroll(thisMCSTop);
          }

          tabs();
          swiperSliderInit();
          // fotoramaInit();

          mainScreenForDesktop();

          // show about items on init
          if ( aboutPage ) {
            showAboutItems.call(this);
          }

        }, onScroll: function () {

          toggleHeaderForCustomScroll(-this.mcs.top);

        }, whileScrolling: function () {

          // parallaxBg(thisMCSTop);

          $(window).trigger("lookup");

          if ($fixedBox.length) {
            var thisMCSTop = -this.mcs.top;
            shareFixedForCustomScroll(thisMCSTop);
          }

          // show about items on scroll
          if ( aboutPage ) {
            showAboutItems.call(this);
          }
        },
        onUpdate: function(){
          // show about items on update
          if ( aboutPage ) {
            showAboutItems.call(this);
          }

        }
      }
    });

    // custom scroll for nav drop
    var $navDropScroll = $('.nav-drop');
    if ($navDropScroll.length) {
      $navDropScroll.mCustomScrollbar({
        theme: "minimal-dark",
        autoHideScrollbar: true,
        autoExpandScrollbar: true,
        scrollInertia: 300
      });
    }

    // custom scroll for sidebar
    var $sidebarScroll = $('.sidebar__holder');
    if ($sidebarScroll.length) {
      $sidebarScroll.mCustomScrollbar({
        theme: "minimal-dark",
        autoHideScrollbar: true,
        autoExpandScrollbar: true,
        scrollInertia: 300
      });
    }

    // custom scroll for sidebar filters drop
    var $sidebarFiltersDrop = $('.filters-drop');
    if ($sidebarFiltersDrop.length) {
      $sidebarFiltersDrop.mCustomScrollbar({
        theme: "minimal-dark",
        autoHideScrollbar: true,
        autoExpandScrollbar: true,
        scrollInertia: 300
      });
    }
  });

  footerBottom();

  // header show / hide
  function toggleHeaderForCustomScroll(value) {
    var currentScrollTop = value;

    var showHeaderPanel = currentScrollTop < minScrollTop || currentScrollTop < previousScrollTop;

    $body.toggleClass('header-show', showHeaderPanel);

    previousScrollTop = currentScrollTop;
  }

  // share box fixed
  var $barrier = $('.full-width-js'),
      $footer = $('.footer'),
      topSpace = 50,
      $fixedMarker = $('<div />');

  $fixedMarker.insertBefore($fixedBox).css({
    'height': 0,
    'width': 0,
    'float': 'left'
  });

  function shareFixedForCustomScroll(scrollTop) {
    if (!$fixedBox.length) return false;

    var fixedBoxHeight = $fixedBox.outerHeight(),
        fixedBoxFullHeight = fixedBoxHeight + topSpace*2,
        footerOffsetTop = $footer.offset().top,
        fixedMarkerPositionTop = $fixedMarker.position().top;

    var $wrapper = $fixedBox.parent(),
        wrapperHeight = $wrapper.outerHeight(),
        wrapperPositionTop = $wrapper.position().top,
        topPadding = fixedMarkerPositionTop - wrapperPositionTop,
        bottomPadding = +$wrapper.css("padding-top").replace("px", ""),
        wrapperInnerHeight = wrapperHeight - (topPadding + bottomPadding);

    if (wrapperInnerHeight <= fixedBoxHeight) {
      clearFixedBoxStyles();

      return false;
    }

    if ($barrier.length && $barrier.outerHeight() > 0) {
      var barrierHeight = $barrier.outerHeight(),
          showBeforeBarrier = $barrier.position().top + barrierHeight - topSpace,
          wrapperMinHeight = fixedBoxHeight*2 + barrierHeight;

      if (wrapperInnerHeight <= wrapperMinHeight) {
        clearFixedBoxStyles();

        return false;
      }

      if (scrollTop >= showBeforeBarrier) {
        $fixedBox
            .addClass('fixed')
            .css({
              'position': 'fixed',
              'top': topSpace
            });
      } else {
        clearFixedBoxStyles();
      }
    } else {
      if (scrollTop >= fixedMarkerPositionTop - topSpace) {
        $fixedBox
            .addClass('fixed')
            .css({
              'position': 'fixed',
              'top': topSpace
            });
      } else {
        clearFixedBoxStyles();
      }
    }

    if (footerOffsetTop <= fixedBoxFullHeight) {
      $fixedBox
          .addClass('stick-bottom')
          .css({
            'top': footerOffsetTop - fixedBoxFullHeight + topSpace
          });
    } else {
      $fixedBox.removeClass('stick-bottom');
    }
  }

  function clearFixedBoxStyles() {
    $fixedBox
        .removeClass('fixed')
        .css({
          'position': 'relative', 'top': 'auto'
        });
  }

  // show about item on change layout
  function showAboutItems() {
    var $items = this.mcs.content.find('.about__item');
    var animationSpeed = 0.8;

    var scrollTop = -this.mcs.top;
    $items.each(function (i) {
      // console.log(scrollTop);
      var $this = $(this);
      var positionTop = $this.position().top;
      // var gh = $(this).height();
      // console.log(Math.round(gh));

      if (scrollTop > Math.round(positionTop) - $(window).height() + 100) {
        $this.addClass('show');
        TweenMax.to($this, animationSpeed,{autoAlpha: 1, delay: 0.2});
      }
    });
  }
}
/*custom scroll on page end*/


//screen swipe proceed
if (TABLET === true || MOBILE === true) {

  if ($('.screen').length > 0) {

    var $page = $('body');

    $page.css('overflow', 'hidden');

    $('.screen').on('swipeup', function() {

      $page.addClass('hide-screen');

      $page.removeAttr('style');

    });

  }
}

/*state form fields*/
function stateFields(){
  $('.is-validate select').on('change', function() {
    var $currentSelect = $(this);
    var selectedOptionIndex = $currentSelect.find('option:selected').index();
    var completeClass = 'input-complete';

    $currentSelect
        .toggleClass(completeClass, selectedOptionIndex !== 0)
        .closest('.select')
        .toggleClass(completeClass, selectedOptionIndex !== 0);
  });

  $( ".is-validate input, .is-validate textarea" ).on('change keyup', function() {
    var _textDefault = $(this).val().length;
    $(this).toggleClass('input-complete', !!_textDefault);
  });
}
/*state form fields*/

/*print*/
function printShow() {
  $('.view-print').on('click', function (e) {
    e.preventDefault();
    window.print();
  });
}
/*print end*/

/*main screen for mobile*/
function mainScreenForMobile() {

  var $html = $('html, body'),
      page = '.home-page',
      $page = $(page),
      $screen = $('.screen'),
      _minScrollTop = 20,
      _animationSpeed = 400,
      _flagPositionCorrection = true;

  $(window).on('load scroll resizeByWidth', function () {

    $(window).trigger("lookup");

    var currentScrollTop = $(window).scrollTop(),
        _hideScreen = currentScrollTop > _minScrollTop;

    if ( _hideScreen && _flagPositionCorrection ) {
      $page.addClass('hide-screen');

      if ( $('body').hasClass('home-page') ) {
        history.pushState({}, '', '?hide-screen');
      }
    }

    $('.screen__btn .btn-default').on('click', function(event) {
      event.preventDefault();
      $page.addClass('hide-screen');

      if ( $('body').hasClass('home-page') ) {
        history.pushState({}, '', '?hide-screen');
      }
    });

    if ( $('body').hasClass(page.substring(1)) && !$html.is(':animated') && _flagPositionCorrection ) {
      $html.stop().animate({
        scrollTop: 0}, {
        duration: 0,
        complete: function(){
          _flagPositionCorrection = false;
        }
      });
    }

  });

  if ($('.js-scene').length > 0) {
    $('.js-scene .scene-wrap').remove();
    $('.js-scene img').unveil();
    $('.js-scene-tablet').show();
  }

}
/*main screen for mobile end*/

/*main screen for desktop*/
function mainScreenForDesktop() {
  var $body = $('body'),
      $pageHome = $('.home-page'),
      _screenHided = false;

  if ($pageHome.length && !_screenHided) {

    var newDelta = 0;

    $('.screen').on('mousewheel', function(event) {

      $body.mCustomScrollbar("disable");

      var deltaY = event.deltaY;
      newDelta = newDelta + deltaY;

      if (newDelta < -1) {
        $body.addClass('hide-screen');

        if ( $('body').hasClass('home-page') ) {
          history.pushState({}, '', '?hide-screen');
        }

        $body.mCustomScrollbar("update");
        $body.mCustomScrollbar("scrollTo","top");
        _screenHided = true;
      }
    });

    $('.screen__btn .btn-default').on('click', function(event) {
      event.preventDefault();
      $body.addClass('hide-screen');

      if ( $('body').hasClass('home-page') ) {
        history.pushState({}, '', '?hide-screen');
      }

      $body.mCustomScrollbar("update");
      $body.mCustomScrollbar("scrollTo","top");
      _screenHided = true;
    });
  }

  if ($('.js-scene').length > 0) {
    $('.js-scene img').unveil();
  }
}
/*main screen for desktop end*/

/* tabs */
function tabs() {
  var $helpfulTabs = $('.tabs-wrap');
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
      activate: function(event, tab) {
        clearTimeout(equalTimer);
        equalTimer = setTimeout(function () {
          equalHeightForTabs($(tab.panel));
        }, 500);
      }
    });
  }
}

function equalHeightForTabs(content){
  $(window).trigger("lookup");
  var $parent = $('.products__list', content);
  if ($parent.length) {
    $('.products__inner', $parent).equalHeight({
      useParent: true,
      parent: $parent,
      resize: true
    });
  }
}
/* tabs end */

/*equal height elements*/
function equalHeightInit(){
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

      // _____________________НОВЫЙ КОД !!!!!
      // переход по ссылкам с пресетом фильтра
      var years = getQueryVariable('filter-preset-age');
      var skill = getQueryVariable('filter-preset-skill');
      var category = getQueryVariable('filter-preset-cat');


      if($.trim(years)) {
        $('.filters-button[data-filter=".tag-'+years+'"]').trigger('click');
      }
      if($.trim(skill)) {
        $('a[data-filter=".tag-'+skill+'"]').trigger('click');
      }
      if($.trim(category)) {
        $('a[data-filter=".tag-'+category+'"]').trigger('click');
      }



      // _____________________НОВЫЙ КОД КОНЕЦ!!!!!


    });
  }
}
/*equal height elements end*/

/* multiselect init */
/*add ui position add class*/
function addPositionClass(position, feedback, obj){
  removePositionClass(obj);
  obj.css( position );
  obj
      .addClass( feedback.vertical )
      .addClass( feedback.horizontal );
}

/*add ui position remove class*/
function removePositionClass(obj){
  obj.removeClass('top');
  obj.removeClass('bottom');
  obj.removeClass('center');
  obj.removeClass('left');
  obj.removeClass('right');
}

function customSelect(select){
  if ( select.length ) {
    selectArray = [];
    select.each(function(selectIndex, selectItem){
      var placeholderText = $(selectItem).attr('data-placeholder');
      var flag = true;
      if ( placeholderText === undefined ) {
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
        create: function(event){
          var select = $(this);
          var button = $(this).multiselect('getButton');
          var widget = $(this).multiselect('widget');
          button.wrapInner('<span class="select-inner"></span>');
          button.find('.ui-icon').append('<i class="arrow-select"></i>')
              .siblings('span').addClass('select-text');
          widget.find('.ui-multiselect-checkboxes li:last')
              .addClass('last')
              .siblings().removeClass('last');
          if ( flag ) {
            $(selectItem).multiselect('uncheckAll');
            $(selectItem)
                .multiselect('widget')
                .find('.ui-state-active')
                .removeClass('ui-state-active')
                .find('input')
                .removeAttr('checked');
          }
        },
        selectedText: function(number, total, checked){
          var checkedText = checked[0].title;
          return checkedText;
        },
        position: {
          my: 'left top',
          at: 'left bottom',
          using: function( position, feedback ) {
            addPositionClass(position, feedback, $(this));
          }
        }
      });
    });
    $(window).resize(selectResize);
  }
}

function selectResize(){
  if ( selectArray.length ) {
    $.each(selectArray, function(i, el){
      var checked = $(el).multiselect('getChecked');
      var flag = true;
      if ( !checked.length ) {
        flag = false;
      }
      $(el).multiselect('refresh');
      if ( !flag ) {
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
/* multiselect init end */

/**! filters
 * filter products for tags */
// external js:
// 1) TweetMax VERSION: 1.19.0 (widgets.js);
// 2) resizeByWidth (this file);
function filtersEvents() {
  // external js: Isotope PACKAGED v3.0.1 (widgets.js);
  var $body = $('body'),
      $filtersWrapper = $('.products'),
      $filters = $('.filters-js'),
      $filtersTagsGroup = $('.filters-tags-js'),
      $productsContainer = $('.filters-container-js'),
      $jsDropContent = $('.filters-content-js'),
      $filtersOptions = $('.filters-options-js'),
      jsDrop = '.filters-drop-js',
      $jsDrop = $(jsDrop),
      jsDropOpener = '.filter-more-options-js',
      $jsDropOpener = $(jsDropOpener),
      jsFiltersOpener = '.btn-filter-opener-js',
      $jsFiltersOpener = $(jsFiltersOpener),
      jsFiltersCloser = '.btn-filter-close-js',
      $jsFiltersCloser = $(jsFiltersCloser),
      tags = {},
      classShowDrop = 'show-drop',
      isCheckedClass = 'is-checked',
      dataFilter = 'data-filter',
      animationSpeed = 200,
      animationSpeedTween = animationSpeed/1000,
      showButtonFind = false,
      methodAndInit = false,
      methodOrInit = false,
      filtersDropShow = false;

  // init Isotope
  var $grid = $filtersWrapper.isotope({
    itemSelector: '.products__item',
    layoutMode: 'fitRows',
    percentPosition: true
  });

  // bind filter tag click
  $filtersTagsGroup.on( 'click', 'a', function(e) {
    e.preventDefault();

    var $currentTag = $( this ),
        dataTagsGroup = $currentTag.closest('.tags-group-js').attr('data-tags-group'),
        currentDataFilter = $currentTag.attr(dataFilter),
        filterMethod = $currentTag.closest($filtersTagsGroup).attr('data-filter-method'),
        currentIsTagChecked = $currentTag.hasClass(isCheckedClass);

    // var $currentTagIsInFilters = $currentTag.parents().hasClass(jsDrop.substring(1));
    if (filterMethod == 'or' && !currentIsTagChecked) {
      methodOrInit = true;
    } else if (filterMethod == 'or' && currentIsTagChecked) {
      methodOrInit = false;
    }

    if (currentIsTagChecked && filterMethod == 'and') {
      methodAndInit = false;
    } else if (filterMethod == 'and') {
      methodAndInit = currentDataFilter;
    }

    dataTagsGroup = (dataTagsGroup === undefined) ?
        currentDataFilter :
        dataTagsGroup;

    // tags [ dataTagsGroup ] = (currentIsTagChecked) ?
    // 	'' :
    // 	currentDataFilter;

    if (currentIsTagChecked) {
      tags [ dataTagsGroup ] = '';
    } else {
      tags [ dataTagsGroup ] = currentDataFilter;
    }

    var filterValue = (filterMethod == 'or' || methodAndInit || currentIsTagChecked) ? concatValuesOR( tags ) : concatValuesEND ( tags );

    $grid.isotope({ filter: filterValue });

    showButtonFind = true;
  });

  // concatenation values of tags OR;
  // example return '.prop1, .prop2';
  // show items which contains prop1 or prop2;
  function concatValuesOR(obj) {
    var value,
        // arr = Object.keys(obj);
        arr = [];

    for ( var prop in obj ) {
      var thisProp = obj[ prop ];
      if (!thisProp) continue;
      if (methodOrInit && obj[ prop ] == methodAndInit) continue;
      thisProp = (methodAndInit) ? (methodAndInit + thisProp) : thisProp;
      arr.push(thisProp);
    }

    value = arr.join(', ');
    return value;
  }

  // concatenation values of tags END;
  // example return '.prop1.prop2';
  // show items which contains prop1 and prop2;
  function concatValuesEND(obj) {
    var value = '';

    for ( var prop in obj ) {
      value += obj[ prop ];
    }

    return value;
  }

  // search
  $( ".filters-search-js input" ).on('change keyup', function() {
    var text = $(this).val();

    $grid.isotope({ filter: function() {
        var name = $(this).find('.products__title').text();
        return name.match( new RegExp('(' + text + ')', 'gi') );
      } });
  });

  // toggle class checked
  $filtersTagsGroup.on( 'click', 'a', function(e) {
    e.preventDefault();

    var $this = $( this );

    $this.parent().find('.filter-radio.is-checked').not(e.target).removeClass('is-checked');

    $this.toggleClass('is-checked');

    clearBtnState();
    toggleFiltersOptions();
  });

  // prepare filters options
  function prepareFiltersOptions() {
    TweenMax.set($filtersOptions, {autoAlpha: 0, percentY: 100, onComplete: function () {
        $('.filters-options-js').show(0);
      }});
  }
  prepareFiltersOptions();

  // toggle filters options
  function toggleFiltersOptions() {
    if($filtersTagsGroup.find('.is-checked').length && filtersDropShow) {
      TweenMax.to($filtersOptions, animationSpeedTween,{autoAlpha: 1, percentY: 0});
    } else {
      TweenMax.to($filtersOptions, animationSpeedTween,{autoAlpha: 0, percentY: 100});
    }
  }

  function eventBtnShowItem() {
    $body.on('click', '.show-filter-items-js', function (e) {
      e.preventDefault();

      $jsDropOpener.trigger('click');
      if (DESKTOP) {
        $body.mCustomScrollbar("scrollTo", 'top');
      } else {
        $('html,body').stop().animate({scrollTop: 0}, animationSpeed);
      }
    });
  }
  eventBtnShowItem();

  // filters drop
  $jsDropContent.on('click', jsDropOpener, function () {
    var $currentJsDropContent = $(this).closest($jsDropContent),
        $currentDrop = $currentJsDropContent.find($jsDrop),
        currentDropOpened = $currentDrop.hasClass(classShowDrop);

    toggleFiltersDrop($jsDrop,$currentDrop,!currentDropOpened);

    toggleBtnText($(this).find('span'), currentDropOpened);

    // switch classes
    switchClass($jsDropContent,$currentJsDropContent,!currentDropOpened);
    switchClass($jsDropOpener,$(this),!currentDropOpened);
    switchClass($jsDrop,$currentDrop,!currentDropOpened);

    phonesDropHeight.call();

    return false;
  });

  $jsDropContent.on('click', jsDrop, function (e) {
    e.stopPropagation();
    return false;
  });

  $jsDropContent.on('click', '.phones-drop a', function () {
    document.location.href = $(this).attr('href');
  });

  // toggle "additional filters" drop
  function toggleFiltersDrop(drops,currentDrop,condition) {
    drops = drops || $jsDrop;
    // close all drops
    TweenMax.to(drops, animationSpeedTween, {autoAlpha: 0, ease: Power2.easeInOut});
    filtersDropShow = false;
    fixedContainerHeight(false);
    toggleFiltersOptions();

    // enable page scroll
    toggleScrollPage('switch-drop');

    if(currentDrop === undefined) return false;

    if(condition){
      // open current drop
      TweenMax.to(currentDrop, animationSpeedTween, {autoAlpha: 1, ease: Power2.easeInOut});
      filtersDropShow = true;
      fixedContainerHeight();

      // disable page scroll
      toggleScrollPage('switch-drop', false);
    }
  }

  // toggle text in button "additional filters"
  function toggleBtnText(btn, cond) {
    var textShow = 'Show filters',
        textHide = 'Hide filters';

    if (btn === undefined) return false;

    (cond === false) ? btn.text(textHide) : btn.text(textShow);
  }

  // recalculate height of phone drop
  $(window).on('resize scroll', function () {
    phonesDropHeight.call();
  });

  function phonesDropHeight() {
    var topSpace = $('.filters').outerHeight();
    var windowHeight = $(window).height() - topSpace;

    $jsDrop.css('height', windowHeight);
  }

  // add "no product" template
  var tempNoProducts = $('<h2 style="text-align: center;">Items not found</h2>');
  tempNoProducts.hide().insertAfter($filtersWrapper);
  $grid.on( 'arrangeComplete', function( event, filteredItems ) {
    var lengthItems = filteredItems.length,
        filterCounterContent = 'Items <br /> not found';

    // search counter
    if( lengthItems > 0 ) {
      var items = (filteredItems.length > 1) ? 'items' : 'item';
      filterCounterContent = 'Found <span style="display: inline-block;"><strong>' + lengthItems + '</strong> ' + items + '</span>';
    }

    $('.filters-counter-js')
        .html(filterCounterContent)
        .closest('.filters-button')
        .toggleClass('btn-show', showButtonFind);

    // "no product" show / hide
    if (!lengthItems) {
      tempNoProducts.show();
    } else {
      tempNoProducts.hide();
    }

    $(window).trigger("lookup");
  });

  // clear filter tags
  clearFilters();

  $('.clear-filters').on('click', function (e) {
    e.preventDefault();

    if ($(this).hasClass('disabled')) return;

    clearFilters();
    methodOrInit = false;
  });

  function clearFilters() {
    $filtersTagsGroup.find('.is-checked').removeClass('is-checked');
    $grid.isotope({filter: '*'});
    tags = {};

    switchClass($jsDropContent);
    switchClass($jsDropOpener);
    switchClass($jsDrop);
    toggleFiltersDrop($jsDrop);

    clearBtnState();

    showButtonFind = false;
  }

  // clear on horizontal resize
  $(window).on('resizeByWidth', function () {
    if ( $filters.attr('style') ) {
      $filters.attr('style','');
      $jsDropOpener.trigger('click');
      toggleScrollPage('mobile-filter-panel');
    }
  });

  // open filters on mobile
  var filtersTLL = new TimelineLite();
  $body.on('click', jsFiltersOpener, function () {
    filtersTLL
        .set($filters, {autoAlpha:1, transitionDuration: 0})
        .to($filters, animationSpeedTween, {x: 0, ease: Power2.easeInOut});

    toggleScrollPage('mobile-filter-panel', false);

    return false;
  });

  // close filters on mobile
  $body.on('click', jsFiltersCloser, function () {
    var filtersWidth = $('.filters-js').outerWidth();
    filtersTLL.to($filters, animationSpeedTween, {x: -filtersWidth, ease: Power2.easeInOut});

    toggleScrollPage('mobile-filter-panel');

    return false;
  });

  // switch class
  function switchClass(remove,add,condition) {
    // remove - element with remove class
    // add - element with add class
    // condition - condition add class

    remove.removeClass(classShowDrop);

    if(add === undefined) return false;
    add.toggleClass(classShowDrop, condition);
  }

  // state clear button
  function clearBtnState() {
    $('.clear-filters').toggleClass('disabled', !$filtersTagsGroup.find('.is-checked').length);
  }
  clearBtnState();

  // fixed height container products
  function fixedContainerHeight(fixed) {
    var productsContainerHeight = $productsContainer.outerHeight();

    if (fixed === false) {
      $productsContainer.css({
        'min-height': 0,
        'max-height': 'none'
      });
    } else {
      $productsContainer.css({
        'min-height': productsContainerHeight,
        'max-height': productsContainerHeight
      });
    }
  }
}
/*filters end*/

/*share events*/
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
/*share events end*/

/*share fixed*/
function shareFixed(){
  var $fixedBox = $('.soc-js');

  if(!$fixedBox.length) return false;

  var fixedBoxTopPosition = $fixedBox.offset().top,
      $barrier = $('.full-width-js'),
      $bottom = $('.footer'),
      topSpace = 50;

  $(window).on('load scroll resizeByWidth', function () {

    var barrierTopPosition = $barrier.offset().top,
        barrierHeight = $barrier.outerHeight(),
        fixedBoxHeight = $fixedBox.outerHeight(),
        bottomTopPosition = $bottom.offset().top,
        currentScrollTop = $(window).scrollTop();

    if (currentScrollTop >= (fixedBoxTopPosition - topSpace)) {
      $fixedBox
          .addClass('fixed')
          .css({
            'position': 'fixed',
            'top': topSpace
          });
    } else {
      $fixedBox
          .removeClass('fixed')
          .css({
            'position': 'relative',
            'top': 'auto'
          });
    }

    if (currentScrollTop >= barrierTopPosition - fixedBoxHeight - topSpace*2 && currentScrollTop < barrierTopPosition + barrierHeight || currentScrollTop >= bottomTopPosition - fixedBoxHeight - topSpace*2) {
      var tl = TweenMax.to($fixedBox, 0.1, {autoAlpha: 0, ease: Power2.easeInOut});
    } else {
      TweenMax.to($fixedBox, 0.1, {autoAlpha: 1, ease: Power2.easeInOut});
    }
  });
}
/*share fixed end*/

/*hover class*/
(function ($) {
  // external js:
  // 1) device.js 0.2.7 (widgets.js);
  // 2) debouncedresize (widgets.js);

  var HoverClass = function (settings) {
    var options = $.extend({
      container: 'ul',
      item: 'li',
      drop: 'ul'
    },settings || {});

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
      $(window).on('debouncedresize', function () {
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

    $container.on('click', ''+item+'', function (e) {

      if (self.desktop || $(window).width() < 980) return;

      var $currentItem = $(this);

      if (!$currentItem.has($drop).length){
        return;
      }

      if ($currentItem.hasClass(_hover)){
        $currentItem
            .removeClass(_hover)
            .find('.'+_hover+'')
            .removeClass(_hover);

        return;
      }

      $item.removeClass(_hover);
      $currentItem.addClass(_hover);

      return false;
    });

    $drop.children().not('.close-nav-drop-js').on('click', function (e) {
      if (self.desktop || $(window).width() < 980) return;

      e.stopPropagation();
    });

    $(document).on('click', function () {
      if (self.desktop || $(window).width() < 980) return;

      $item.removeClass(_hover);
    });

    if (self.desktop) {
      $container.on('mouseenter', ''+item+'', function () {
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
      $container.on('mouseleave', ''+ item+'', function () {
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
    self.$item.removeClass(self.modifiers.hover );
  };

  window.HoverClass = HoverClass;

}(jQuery));

function hoverClassInit(){
  var $navList = $('.nav');
  if($navList.length){
    new HoverClass({
      container: $navList,
      drop: '.js-nav-drop'
    });
  }
}
/*hover class end*/

/*navigation drop behavior*/
function navDropHeight() {
  var $navDrop = $('.js-nav-drop');
  if (!$navDrop.length) return false;

  $(window).on('load resize', function () {
    $navDrop.css('height', $(window).outerHeight());
  });
}

function navDropEvents(){
  // external js:
  // 1) TweetMax VERSION: 1.19.0 (widgets.js);
  // 2) resizeByWidth (in this file);
  // 3) toggleScrollPage function (in this file);

  var $navDrop = $('.js-nav-drop');
  if($navDrop.length){
    var $html = $('html'),
        $item = $('.nav-list .has-drop'),
        activeClass = 'show-nav-drop',
        animateSpeed = 0.2,
        $sidebarOverlay = $('<div class="overlay">');

    $item.each(function () {
      var $currentItem = $(this),
          $currentNavDrop = $currentItem.find('.nav-drop');

      if (DESKTOP) {
        $currentItem.on('mouseenter', function () {

          if ($(window).width() >= 980) {
            openNavDrop();
          }

        }).on('mouseleave', function () {

          closeNavDrop();

        });

        $currentItem.on('click', function (e) {
          e.stopPropagation();
        });
      }

      if(!DESKTOP){
        $currentItem.on('click', function () {
          if ($(window).width() >= 980) {
            openNavDrop();

            equalHeightNavDropGroup();
            createOverlay();
          }
        });
      }

      $(document).on('click', function () {
        closeNavDrop();
      });

      $('.close-nav-drop-js').on('click', function (e) {
        e.preventDefault();

        closeNavDrop();

        return false;
      });

      $(window).on('resizeByWidth', function () {
        if ($currentNavDrop.is(':visible')) {
          closeNavDrop();
        }
      });

      function openNavDrop() {
        toggleScrollPage('nav-drop-events', false);

        // $html.addClass(activeClass);
        TweenMax.set($currentNavDrop, {display: 'block'});
        TweenMax.to($currentNavDrop, animateSpeed, {autoAlpha: 1, onComplete: function () {
            $('.sidebar__holder').mCustomScrollbar('update');
          }});

        equalHeightNavDropGroup();
        createOverlay();
      }

      function closeNavDrop() {
        toggleScrollPage('nav-drop-events');

        // $html.removeClass(activeClass);
        $currentItem.closest('li.hover').removeClass('hover');
        TweenMax.to($currentNavDrop, animateSpeed, {
          autoAlpha: 0, onComplete: function () {
            $currentNavDrop.hide();
          }
        });
        createOverlay('close');
      }

      function equalHeightNavDropGroup() {
        var $navDropGroup = $navDrop.find('.nav-drop__group');

        $navDropGroup.equalHeight({
          resize: true,
          amount: $navDropGroup.length
        });

        $navDropGroup.css('min-height', $(window).outerHeight());
      }

      function createOverlay(close) {
        if(close == "close"){
          TweenMax.to($sidebarOverlay, animateSpeed, {autoAlpha:0, onComplete:completeHandler});
          function completeHandler() {
            $sidebarOverlay.remove();
          }
        } else {
          $sidebarOverlay.appendTo('body');
          TweenMax.to($sidebarOverlay, animateSpeed, {autoAlpha:0.8});
        }
      }
    });
  }
}
/*navigation drop behavior end*/

/*map init*/
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
  ],[
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
    "stylers": [{"color": "#ffffff"}]
  }, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"}]}, {
    "featureType": "transit.station.airport",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#cfb2db"}]
  }, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"}]}
];

function mapMainInit(){
  if (!$('[id*="-map"]').length) {return;}

  function mapCenter(index){
    var localObject = localObjects[index];

    return{
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

  if($(elementById[0]).length){
    mapOptions = {
      zoom: 15,
      center: mapCenter(0),
      styles: styleMap,
      mapTypeControl: false,
      scaleControl: false,
      scrollwheel: false
    };

    var map0 = new google.maps.Map(elementById[0], mapOptions);
    addMarker(0,map0);

    /*aligned after resize*/
    var resizeTimer0;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer0);
      resizeTimer0 = setTimeout(function () {
        moveToLocation(0,map0);
      }, 500);
    });
  }

  if($(elementById[1]).length){
    mapOptions = {
      zoom: 15,
      center: mapCenter(1),
      styles: styleMap,
      mapTypeControl: false,
      scaleControl: false,
      scrollwheel: false
    };

    var map1 = new google.maps.Map(elementById[1], mapOptions);
    addMarker(1,map1);

    /*aligned after resize*/
    var resizeTimer1;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer1);
      resizeTimer1 = setTimeout(function () {
        moveToLocation(1,map1);
      }, 500);
    });
  }

  /*move to location*/
  function moveToLocation(index, map){
    var object = localObjects[index];
    var center = new google.maps.LatLng(mapCenter(index));
    map.panTo(center);
    map.setZoom(object[3]);
  }

  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 220
  });

  function addMarker(index,map) {
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
          '<h4>'+object[4].title+'</h4>' +
          '<div class="map-popup__list">' +
          '<div class="map-popup__row">'+object[4].address+'</div>' +
          '<div class="map-popup__row">'+object[4].phone+'</div>' +
          '<div class="map-popup__row">'+object[4].works+'</div>' +
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
/*map init end*/

/*contacts*/
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

    if (tabEvent){
      switchStateTab($currentWrapper,$tab);
      switchStateTab($currentWrapper,$tab,index);
    }

    if (!tabEvent){
      switchStateTab($currentWrapper,$map);
      switchStateTab($currentWrapper,$map,index);
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

      switchStateTab($currentWrapper,$tab,index);
      switchStateTab($currentWrapper,$map);

    } else {
      tabEvent = false;

      switchStateTab($currentWrapper,$tab);
      switchStateTab($currentWrapper,$map,index);
    }
  });

  function switchStateTab(content,tab,index) {
    // if property "index" length class added
    // else class removed
    if (Array.isArray(tab)){
      for(var i = 0; i < tab.length; i++) {
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
/*contacts end*/

/*swiper slider initial*/
// external js:
// 1) Swiper 3.3.1 (widgets.js);
// 2) TweetMax VERSION: 1.19.0 (widgets.js);
function swiperSliderInit() {
  var $slider = $('.swiper-container');

  if ($slider.length) {
    var slideHolder = '.swiper-holder', classVideoPlayed = 'video-played', animateSpeed = 0.3;

    new Swiper($slider, {
      loop: true, nextButton: '.swiper-button-next', prevButton: '.swiper-button-prev', // effect: 'coverflow',
      grabCursor: false, centeredSlides: true, slidesPerView: 'auto', speed: 600, parallax: false, simulateTouch: true, coverflow: {
        rotate: 0, modifier: 4, stretch: 0, slideShadows: false, scale: 0.8
      }, slideToClickedSlide: true, slideNextClass: 'swiper-slide-next', slidePrevClass: 'swiper-slide-prev', onInit: function (event, a) {
        var $iframe = $('<iframe src="about:blank" frameborder="0" allowfullscreen></iframe>'), thisSlideHolder = $(event.slides).find(slideHolder);

        TweenMax.set($iframe, {autoAlpha: 0});

        $iframe
            .addClass('swiper-video')
            .css({
              'width': '100%', 'height': '100%'
            })
            .prependTo(thisSlideHolder);
      }, onSlideChangeStart: function(){
        closeSwiperVideo();
      }
    });
  }

  $slider.on('click', '.play-video-js', function (e) {
    e.preventDefault();

    playSwiperVideo.call(this);
  });

  $slider.on('click', '.close-video-js', function (e) {
    e.preventDefault();

    closeSwiperVideo();
  });

  /*add video to each slide*/
  function playSwiperVideo() {
    var $playBtn = $(this),
        $container = $playBtn.closest($('.swiper-slide'));

    $container.addClass(classVideoPlayed);

    $playBtn.hide(0);
    $container.find($('.swiper-img-js')).hide(0);
    $container.find($('.swipe-title-js')).hide(0);
    $playBtn.closest($slider).find('.swiper-button-prev').hide(0);
    $playBtn.closest($slider).find('.swiper-button-next').hide(0);


    var $iframe = $container.find('iframe');
    var src = $playBtn.attr('href');

    $iframe.attr("src", src + '?rel=0&autoplay=1');
    TweenMax.to($iframe, animateSpeed, {autoAlpha:1});

    $container.find('.close-video-js').show(0);
  }

  function closeSwiperVideo() {

    var $content = $('.video-played');

    $content.find('.close-video-js').hide(0);
    $content.find($('.swiper-img-js')).show(0);
    $content.find($('.swipe-title-js')).show(0);
    $content.find('.play-video-js').show(0);
    $('.swiper-button-prev').show(0);
    $('.swiper-button-next').show(0);


    var $iframe = $content.find('iframe');

    $iframe.attr("src", 'about:blank');
    TweenMax.to($iframe, animateSpeed, {autoAlpha: 0});

    $content.removeClass(classVideoPlayed);
  }
}
/*swiper slider initial end*/

/*header fixed*/
function headerFixed(){
  // external js:
  // 1) resizeByWidth (resize only width);

  var $page = $('body'),
      minScrollTop = $('.header').outerHeight();

  var previousScrollTop = $(window).scrollTop();
  $(window).on('load scroll resizeByWidth', function () {
    var currentScrollTop = $(window).scrollTop();
    var showHeaderPanel = currentScrollTop < minScrollTop || currentScrollTop < previousScrollTop;

    $page.toggleClass('header-show', showHeaderPanel);

    previousScrollTop = currentScrollTop;
  });
}
/*header fixed end*/

/*main navigation*/
(function ($) {
  // external js:
  // 1) TweetMax VERSION: 1.19.0 (widgets.js);
  // 2) device.js 0.2.7 (widgets.js);
  // 3) resizeByWidth (resize only width);
  var MainNavigation = function (settings) {
    var options = $.extend({
      mainContainer: 'html',
      navContainer: null,
      navMenu: '.nav-list',
      btnMenu: '.btn-menu',
      navMenuItem: '.nav-list > li',
      navMenuAnchor: 'a',
      navDropMenu: '.js-nav-drop',
      staggerItems: null,
      navFooter: '.sidebar-footer__holder',
      overlayClass: '.nav-overlay',
      overlayAppend: 'body',
      overlayAlpha: 0.8,
      classNoClickDrop: '.no-click', // Класс, при наличии которого дроп не буте открываться по клику
      classReturn: null,
      overlayBoolean: false,
      animationSpeed: 300,
      animationSpeedOverlay: null,
      minWidthItem: 100
    },settings || {});

    var self = this,
        container = $(options.navContainer),
        _animateSpeed = options.animationSpeed;

    self.options = options;
    self.$mainContainer = $(options.mainContainer);            // Основной контейнер дом дерева. по умолчанию <html></html>
    self.$navMenu = $(options.navMenu);
    self.$btnMenu = $(options.btnMenu);                        // Кнопка открытия/закрытия меню для моб. верси;
    self.$navContainer = container;
    self.$navMenuItem = $(options.navMenuItem, container);     // Пункты навигации;
    self.$navMenuAnchor = $(options.navMenuAnchor, container); // Элемент, по которому производится событие (клик);
    self.$navDropMenu = $(options.navDropMenu, container);     // Дроп-меню всех уровней;
    self.$staggerItems = options.staggerItems || self.$navMenuItem;  //Элементы в стеке, к которым применяется анимация.
    // По умолчанию navMenuItem;
    self.$navFooter = $(options.navFooter);

    self._animateSpeed = _animateSpeed;
    self._classNoClick = options.classNoClickDrop;

    // overlay
    self._overlayBoolean = options.overlayBoolean;            // Добавить оверлей (по-умолчанию == false). Если не true, то не будет работать по клику вне навигации;
    self._overlayClass = options.overlayClass;                // Класс оверлея;
    self.overlayAppend = options.overlayAppend;               // Элемент ДОМ, вконец которого добавится оверлей, по умолчанию <body></body>;
    self.$overlay = $('<div class="' + self._overlayClass.substring(1) + '"></div>'); // Темплейт оверлея;
    self._overlayAlpha = options.overlayAlpha;
    self._animateSpeedOverlay = options.animationSpeedOverlay || _animateSpeed;
    self._minWidthItem = options.minWidthItem;

    self.desktop = device.desktop();

    self.modifiers = {
      active: 'active',
      opened: 'nav-opened'
    };

    self.createOverlay();
    self.switchNav();
    self.clearStyles();
  };

  MainNavigation.prototype.navIsOpened = false;

  // init tween animation
  MainNavigation.prototype.overlayTween = new TimelineMax({paused: true});

  // overlay append to "overlayAppend"
  MainNavigation.prototype.createOverlay = function () {
    var self = this;
    if (!self._overlayBoolean) return false;

    var $overlay = self.$overlay;
    $overlay.appendTo(self.overlayAppend);

    TweenMax.set($overlay, {autoAlpha: 0});

    self.overlayTween.to($overlay, self._animateSpeedOverlay / 1000, {autoAlpha: self._overlayAlpha});
  };

  // show/hide overlay
  MainNavigation.prototype.showOverlay = function (close) {
    var self = this;
    if (!self._overlayBoolean) return false;

    var overlayTween = self.overlayTween;

    if (close === false) {
      overlayTween.reverse();
      return false;
    }

    if (overlayTween.progress() !== 0 && !overlayTween.reversed()) {
      overlayTween.reverse();
      return false;
    }

    overlayTween.play();
  };

  // switch nav
  MainNavigation.prototype.switchNav = function () {
    var self = this,
        $buttonMenu = self.$btnMenu;

    if ($buttonMenu.is(':visible')) {
      self.preparationAnimation();
    }

    $buttonMenu.on('click', function (e) {
      if (self.navIsOpened) {
        self.closeNav();
      } else {
        self.openNav();
      }

      e.preventDefault();
    });

    $(document).on('click', self._overlayClass, function () {
      self.closeNav();
    });
  };

  // open nav
  MainNavigation.prototype.openNav = function() {
    var self = this,
        $html = self.$mainContainer,
        $navContainer = self.$navContainer,
        $buttonMenu = self.$btnMenu,
        _animationSpeed = self._animateSpeedOverlay,
        $staggerItems = self.$staggerItems,
        $sbFooter = self.$navFooter;

    // custom scroll page disabled
    toggleScrollPage('main-navigation', false);

    $html.addClass(self.modifiers.opened);
    $buttonMenu.addClass(self.modifiers.active);

    $navContainer.css({
      '-webkit-transition-duration': '0s',
      'transition-duration': '0s'
    });

    var navTween = new TimelineMax();
    var navInnerTween = new TimelineMax();

    navTween
        .to($navContainer, _animationSpeed / 1000, {
          xPercent: 0, onComplete: function () {
            navInnerTween
                .staggerTo($staggerItems, _animationSpeed / 1000 * 2, {
                  autoAlpha: 1, x: 0, ease: Elastic.easeOut
                }, 0.05)
                .to($sbFooter, _animationSpeed / 1000, {
                  autoAlpha: 1, yPercent: 0
                }, "-=0.4");
          }
        });

    self.showOverlay();

    self.navIsOpened = true;
  };

  // close nav
  MainNavigation.prototype.closeNav = function() {
    var self = this,
        $html = self.$mainContainer,
        $navContainer = self.$navContainer,
        $buttonMenu = self.$btnMenu,
        _animationSpeed = self._animateSpeedOverlay;

    // custom scroll page update
    toggleScrollPage('main-navigation');

    $html.removeClass(self.modifiers.opened);
    $buttonMenu.removeClass(self.modifiers.active);

    self.showOverlay(false);

    TweenMax.to($navContainer, _animationSpeed / 1000, {
      xPercent: -100, onComplete: function () {
        self.preparationAnimation();
        self.navIsOpened = false;
      }
    });
  };

  // preparation element before animation
  MainNavigation.prototype.preparationAnimation = function() {
    var self = this,
        $navContainer = self.$navContainer,
        $staggerItems = self.$staggerItems,
        $sbFooter = self.$navFooter;

    TweenMax.set($navContainer, {xPercent: -100, onComplete: function () {
        $navContainer.show(0);
      }});
    TweenMax.set($staggerItems, {autoAlpha: 0, x: -40});
    TweenMax.set($sbFooter, {autoAlpha: 0, yPercent: 100});
  };

  // clearing inline styles
  MainNavigation.prototype.clearStyles = function() {
    var self = this,
        $buttonMenu = self.$btnMenu,
        $navContainer = self.$navContainer,
        $staggerItems = self.$staggerItems,
        $sbFooter = self.$navFooter;

    //clear on horizontal resize
    $(window).on('resizeByWidth', function () {
      self.$mainContainer.removeClass(self.modifiers.opened);
      $buttonMenu.removeClass(self.modifiers.active);
      self.showOverlay(false);

      if ($buttonMenu.is(':hidden')) {
        $navContainer.show(0);
        TweenMax.set($navContainer, {xPercent: 0});
        TweenMax.set($staggerItems, {autoAlpha: 1, x: 0});
        TweenMax.set($sbFooter, {autoAlpha: 1, yPercent: 0});
      } else {
        // custom scroll page update
        toggleScrollPage('main-navigation');
        self.preparationAnimation();
      }

      self.navIsOpened = false;
    });
  };

  window.MainNavigation = MainNavigation;

}(jQuery));

function mainNavigationInit(){
  var $container = $('.sidebar');
  if(!$container.length){ return; }
  new MainNavigation({
    navContainer: $container,
    staggerItems: $('.nav-list > li > a > span'),
    animationSpeed: 300,
    overlayBoolean: true,
    overlayAlpha: 0.75
  });
}
/*main navigation end*/

/*fotorama init*/
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
      ratio: 1/1
    });

    // Get the API object.
    var fotorama = $galleryFotorama.data('fotorama');

    // Inspect it in console.
    $this.on('click', '.fotorama__grab', function (e) {
      e.preventDefault();
      fotorama.requestFullScreen();
    });

    if(!DESKTOP) {
      fotorama.setOptions({
        arrows: 'always'
      });
    }
  });
}
/*fotorama init end*/

/*text slide events*/
function textSlide() {
  // external js:
  // 1) TweetMax VERSION: 1.19.0 (widgets.js);
  // 2) device.js 0.2.7 (widgets.js);
  // 3) resizeByWidth (resize only width);

  var $textSlide = $('.text-slide-js');

  if (!$textSlide.length) return false;

  var $window = $( window ),
      textFull = 'full description',
      textShort = 'short description',
      $tplSlideFull = $('<div class="text-full text-full-js"><a href="#" class="text-slide-switcher-js"><span>' + textFull + '</span><i class="depict-arrow-down"></i></a></div>'),
      $tplTextSlideInner = $('<div class="text-slide-inner-js" />'),
      $tplShadow = $('<div class="text-slide-shadow-js" >'),
      textSlideHeight = $textSlide.outerHeight(),
      isTextFull = false,
      minHeight = 120;

  $window.on('popupBeforeOpen resize', function () {
    if (!$textSlide.length) return false;

    if ( !$('.text-slide-inner-js').length ) {
      console.log('hide element');

      // hide elements
      TweenMax.set($tplShadow, {autoAlpha: 0});
      $tplSlideFull.hide(0);

      // build structure
      $textSlide
          .wrapInner($tplTextSlideInner)
          .after($tplSlideFull)
          .append($tplShadow);
    }

    var wrapInnerHeight = $('.text-slide-inner-js').outerHeight();

    $textSlide.css('max-height', 'none');

    if (wrapInnerHeight <= minHeight) {
      TweenMax.set($textSlide, {height: 'auto'});
      TweenMax.set($tplShadow, {autoAlpha: 0});
      $tplSlideFull.hide(0);
    } else if ( !isTextFull ) {
      TweenMax.set($textSlide, {height: minHeight});
      TweenMax.set($tplShadow, {autoAlpha: 1});
      $tplSlideFull.show(0);

      textSlideHeight = $textSlide.outerHeight();
    }
  });

  $textSlide.parent().on('click', '.text-slide-switcher-js', function (e) {
    e.preventDefault();

    var wrapInnerHeight = $('.text-slide-inner-js').outerHeight();

    if (wrapInnerHeight <= minHeight) return false;

    var $this = $(this);

    if ( isTextFull ) {
      TweenMax.to($textSlide, 0.5, {
        height: textSlideHeight,
        ease: Power3.easeInOut,
        onComplete: function () {
          $window.trigger('heightMainRecalc');
        }
      });
      TweenMax.to($tplShadow, 0.5, {autoAlpha: 1});

      $this.removeClass('active').children('span').text(textFull);

      isTextFull = false;
    } else {
      TweenMax.to($textSlide, 0.5, {
        height: wrapInnerHeight,
        ease: Power3.easeInOut,
        onComplete: function () {
          TweenMax.set($textSlide, {height: 'auto'});
          $window.trigger('heightMainRecalc');

          isTextFull = true;
        }
      });

      TweenMax.to($tplShadow, 0.5, {autoAlpha: 0});
      $this.addClass('active').children('span').text(textShort);
    }
  });
}
/*text slide events end*/

/*popup events*/
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
        if($('.tape-slider__holder').length > 0) {
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

      if(show_pop) {

        openPopup();
      }

    });
  }

  // _________________________________________ конец костыля



  // switch popup
  $popupOpener.on('click', function (e) {
    e.preventDefault();
    if (!popupOpened) {


      // _________________________________________________МОЙ КОД
      var item_url = $(this).attr('data-url');
      history.pushState({}, '', '/products/'+item_url+'/');
      fill_item_card_data(item_url);

      // ________________________________________________МОЙ КОД_КОНЕЦ

      // openPopup();
    } else {

      closePopup();

    }
  });

  // recalculation main height
  var $window = $(window);
  $window.on('heightMainRecalc', function () {
    if (popupOpened) {
      TweenMax.to($main, 0.2, {height: $popup.outerHeight()}, 0.5);
    }
  });

  // recalculation main height on resize page width
  $window.on('resizeByWidth', function () {
    $window.trigger('heightMainRecalc');
  });

  // close popup on click to "Esc" key
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      closePopup();
    }
  });

  // close popup on click to close button
  $('body').on('click', btnClose, function (e) {
    e.preventDefault();

    // МОЙ КОД
    history.pushState({}, '', '/products/');
    // МОЙ КОД_КОНЕЦ


    closePopup();
  });

  // popup open
  function openPopup() {
    // set scroll position
    if (DESKTOP) {
      topPosition = $('#mCSB_1_container').position().top;
    } else {
      topPosition = $(window).scrollTop();
    }

    $popup.height('auto');
    // show popup
    TweenMax.set($main, {
      height: $popup.outerHeight(),
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

            $('body').removeClass('product-is-card');
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

    TweenMax.set($main, {height: 'auto', onComplete: function () {
        setTimeout(function () {
          pageScrollToItem(topPosition);
        }, 100);
      }});

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
    history.pushState({}, '', '/products/');
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
    if (DESKTOP) {
      $('body').mCustomScrollbar("scrollTo", 0, {
        scrollInertia: 0
      });
    } else {
      TweenMax.to(window, 0.1, {scrollTo: {y: 0}, ease: Power3.easeInOut});
    }
  }

  // page scroll to item
  function pageScrollToItem() {
    topPosition = topPosition || 0;

    if (DESKTOP) {
      $('body').mCustomScrollbar("scrollTo", topPosition, {
        scrollInertia: 0
      });
    } else {
      $('html,body').scrollTop( topPosition );
    }
  }

  // hide filters opener and header
  function toggleMainClass(popupOpened) {
    $('html').toggleClass('popup-show', popupOpened);
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

      pageTitle.replaceWith('<div class="'+classesPageTitle+'">' + pageTitleContent + '</div>');
    }
  }
}
/*popup events end*/

/*!
similar slider
 */
function tapeSlider(reload) {

  'use strict';
  var $frame  = $('.tape-slider__frame');
  var $wrap   = $frame.parent();

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


    if(reload) {
      frame.reload();
    } else {
      frame.init();
    }

    // Reload on resize
    $(window).on('resize', function () {
      frame.reload();
    });
  }
}
/*similar slider*/

/*toggle scroll of page*/
function toggleScrollPage(id) {
  // id is mandatory argument
  // if second arguments equal false
  // page fixed;
  if (id === undefined) return false;

  var $body = $('body'),
      $html = $('html'),
      attr = $html.attr('data-toggle-scroll');

  if (typeof attr !== typeof undefined && attr !== false && attr != id) return false;

  $html.attr('data-toggle-scroll', id);

  var arg = arguments[1];
  if (arg === false) {
    if (DESKTOP) {
      $body.mCustomScrollbar('disable');
    } else {
      $html.addClass('no-scroll');
    }
  } else {
    if (DESKTOP) {
      $body.mCustomScrollbar('update');
    } else {
      $html.removeClass('no-scroll');
    }

    $html.removeAttr('data-toggle-scroll');
  }
}
/*toggle scroll of page end*/

/*parallax background page*/
function parallaxBg(position) {
  var $page = $('body');

  $page.css({
    'background-position-y': -position/3
  });
}
/*parallax background page end*/

/*footer at bottom*/
function footerBottom(){
  var $footer = $('.footer');
  if($footer.length){
    $(window).on('load resizeByWidth', function () {
      var footerOuterHeight = $footer.outerHeight();
      $footer.css({
        'margin-top': -footerOuterHeight
      });
      $('.spacer').css({
        'height': footerOuterHeight
      });
    });
  }
}
/*footer at bottom end*/





// ___________________________________________НОВЫЙ КОД !!!

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}


// __________________________________________НОВЫЙ КОД КОНЕЦ !!!


/*preloader*/
function preloadPage(){

  var $preloader = $('#pagePreloader'),
      $body = $('body');

  if ( $body.hasClass('home-page') ) {
    //$preloader.addClass('preloader-hide');
    setTimeout(function () {
      TweenMax.to($preloader, 0.3, {autoAlpha: 0, onComplete: function () {
          $preloader.hide(0);
          $body.removeClass('preloader-show');
          setTimeout(function () {
            if (DESKTOP) {
              mainScreenForDesktop();
            } else {
              mainScreenForMobile();
            }
          }, 1);
        }});
    }, 1);
  }
  else {
    $preloader.hide();
    $body.removeClass('preloader-show');
  }
}
/*preloader end*/

function imgLazyLoad() {
  if( $('.products__figure').length > 0) {
    $('.products__figure img').unveil();
  }

  //if tabs switched
  //$(window).trigger("lookup");
}

/** ready/load/resize document **/
$(window).load(function () {
  preloadPage();

  popupEvents();
});

$(document).ready(function(){
  pageCustomScroll();
  placeholderInit();
  stateFields();
  printShow();
  equalHeightInit();
  if(DESKTOP){
    customSelect($('select.cselect'));
  }
  // filtersEvents();
  shareEvents();
  hoverClassInit();
  navDropHeight();
  navDropEvents();
  mapMainInit();
  contacts();
  mainNavigationInit();
  // toggleScrollPage(id); // toggle scroll page

  if (!DESKTOP) {
    tabs();
    headerFixed();
    swiperSliderInit();
    // fotoramaInit();
    // tapeSlider();
    // shareFixed();

    footerBottom();
    mainScreenForMobile();
  }
  // parallaxBg();
});