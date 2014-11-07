/*
Css Slider by mjlescano - 2012
*/
;(function( $, window, undefined ){
  var pn = 'cssSlider';
  var defaults = {
    timer: false,
    activeClass: 'active',
    selectors: {
      item: '.item',
      paginator: '.paginator',
      paginatorItem: '.pitem',
      prev: '.prev',
      next: '.next'
    }
  }

  function Plugin( el, options ){
    var self = this
    self.el = el
    self.$el = $(el)
    self.$showing = null

    self.options = $.extend( {}, defaults, options)
    self._defaults = defaults
    self.end = function() { return self.$el }

    self.init()
  }

  Plugin.prototype.init = function (){
    var self = this
    var o = self.options
    var active = o.activeClass
    var s = o.selectors

    function find(selector, $scope){
      if( !$scope ) $scope = self.$el
      return typeof selector == 'string' ? $scope.find(selector) : selector
    }

    var $items = find(s.item)

    var showing = false
    var $showing = self.$el.find('.'+active)

    if( $showing.length ) {
      showing = $items.index($showing) - 1
    }

    self.showing = function() { return showing }

    self.show = function(i){
      if( typeof i !== 'number' ) return NaN
      if( i < 0 || i > $items.length - 1 ) return false
      if( i === showing ) return self

      if( showing !== false ) $showing.removeClass(active)

      $showing = $items.eq(i)
      $showing.addClass(active)

      showing = i

      self.$el.trigger(pn+':shown', $showing)
      return self
    }

    self.showPrev = function(){
      var prev = showing - 1
      return self.show(prev < 0 ? $items.length - 1 : prev)
    }

    self.showNext = function(){
      var next = showing + 1
      return self.show(next > $items.length - 1 ? 0 : next)
    }

    if( typeof self.options.timer === 'number' && self.options.timer ) {
      var interval
      self.start = function() {
        if( interval ) clearInterval( interval )
        interval = setInterval(self.showNext, self.options.timer)
      }
      self.stop = function() {
        if( interval ) clearInterval( interval )
      }
      self.start()
      self.$el.on('mouseenter', self.stop)
      self.$el.on('mouseleave', self.start)
    }

    // Paginator
    ;(function(){
      var $paginator = find(s.paginator)
      var $pitems = find(s.paginatorItem)
      var $active = $pitems.filter('.'+active)

      self.$el.on(pn+':shown', function(){
        var $toShow = $pitems.eq(showing)
        if( $toShow.is($active) ) return
        $active.removeClass(active)
        $active = $toShow.addClass(active)
      })

      $pitems.on('click', function(){
        var $el = $(this)
        if( $el.is($active) ) return
        self.show($pitems.index($el))
      })
    })()

    // Prev / Next
    ;(function(){
      var $prev = find(s.prev)
      $prev.on('click', self.showPrev)
      var $next = find(s.next)
      $next.on('click', self.showNext)
    })()
  }

  $.fn[pn] = function( options ) {
    return this.each(function () {
      if ( ! $.data(this, pn)) {
        $.data(this, pn, new Plugin(this, options))
      }
    })
  }
}(jQuery, window));

/*---- Base SCSS ----
.main_banner {
  position: relative;
  height: 350px;
  .item {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    opacity: 0;
    @include transition (visibility 0s linear 1s, opacity 1s linear);
    &.active {
      visibility: visible;
      opacity: 1;
      -webkit-transition-delay: 0s;
      -moz-transition-delay: 0s;
      -o-transition-delay: 0s;
      transition-delay: 0s;
    }
  }
  .paginator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    .pitem {
      display: inline-block;
      float: left;
      margin: 4px;
      height: 15px;
      width: 15px;
      border-radius: 10px;
      -moz-border-radius: 10px;
      -webkit-border-radius: 10px;
      cursor: pointer;
      box-shadow: inset 0 0 6px black;
      background-color: rgba(0, 0, 0, 0.7);
      &.active {
        cursor: default;
        background-color: red;
        background-color: rgba(255, 30, 30, 0.9);
      }
    }
  }
}

/* ---- Base HAML ----
.main_banner
  .item
  .item.active
  .item
  .item
  .paginator
    .pitem
    .pitem.active
    .pitem
    .pitem

/* ---- Use Example ----
  $('.main_banner').cssSlider({
    timer: 5000
  })
*/
