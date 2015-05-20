$(function() {
  var settings = {
    wait: 100,
    margin: 300
  };
  chrome.storage.local.get({
    searchheight: 25
  }, function(values) {
    settings.margin = $(window).height() * values.searchheight / 100;
  });

  var $topElement = $('body');
  var commander = {
    autofit: function() {
      /**
       * 画面最上部に表示したいエレメントを選択
       */
      var $targetElement = (function() {
        /* 画面トップ付近に存在する全てのエレメントを抽出 */
        var except = (function() {
          var exceptions = ['nav *', 'aside *'];
          var e_roles = ['navigation', 'contentinfo', 'complementary'];
          for (var i=0; i<e_roles.length; i++) {
            exceptions.push('[role="' + e_roles[i] + '"] *')
          }
          var e_words = ['side', 'sub', 'nav'];
          for (var i=0; i<e_words.length; i++) {
            exceptions.push('[id*="' + e_words[i] + '"] *');
            exceptions.push('[class*="' + e_words[i] + '"] *');
          }
          return '*:not(' + exceptions.join(', ') + ')+:visible';
        })();
        var $elementsAroundTop = $topElement.find(except)
          .filter(function() {
            var top = $(this).offset().top;
            var scrollTop = $topElement.scrollTop();
            return top > scrollTop - settings.margin &&
                   top < scrollTop + settings.margin;
          });
        /* ヘッダ要素があれば最も大きいヘッダ要素群、無ければそのまま */
        $headerElements = $elementsAroundTop;
        for (var i=1; i<=6; i++) {
          var $h = $elementsAroundTop.filter('h' + i);
          if ($h.size() > 0) {
            $headerElements = $h;
            break;
          }
        }
        /* 最もスクロール位置が近いものを選択 */
        $closestElement = undefined;
        closest = settings.margin;
        $headerElements.each(function() {
          $e = $(this);
          var dist = Math.abs($e.offset().top - $topElement.scrollTop());
          if (dist < closest) {
            closest = dist;
            $closestElement = $e;
          }
        });

        return $closestElement;
      })();

      /**
       * 選択したエレメントを最上部に表示するようにスクロールする
       */
      (function(target) {
        if (target === undefined) return;

        $topElement.animate({
          scrollTop: target.offset().top
        }, 'fast', 'swing', {
          queue: false
        });
      })($targetElement);
    },
    cancel: function() {
      $topElement.stop();
    }
  };

  /**
   * スクロールの開始と終了を検知し、コマンドを発行する
   */
  (function() {
    var scrolling = true;
    var prevScroll = undefined;
    var timerDetectingScrollFinished = undefined;
    var onDetectScrollFinished = function() {
      scrolling = false;
      commander.autofit();
    };
    var onDetectScrollStarted = function() {
      commander.cancel();
    };
    $(window).on('mousewheel', function(event) {
      onDetectScrollStarted();
      scrolling = true;

      var scroll = $topElement.scrollTop();
      if (scrolling && scroll !== prevScroll) {
        prevScroll = scroll;
        clearTimeout(timerDetectingScrollFinished);
        timerDetectingScrollFinished = setTimeout(onDetectScrollFinished,
                                                  settings.wait);
      }
    });
  })();
});
