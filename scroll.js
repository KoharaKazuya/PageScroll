(function($) {
$(function() {
    var $topElement = $('body');
    var $cover = $('<div>').css({
        'width': $(window).width(),
        'height': 0,
        'background-color': 'black',
        'opacity': 0.2,
        'position': 'absolute',
        'top': 0,
        'left': 0
    });
    $cover.on('click', clearCover);
    $topElement.append($cover);

    $(document).keydown(function(e) {
        var success;
        if (e.isDefaultPrevented() ||
            /input|textarea|select|embed/i.test(e.target.nodeName) ||
            e.target.isContentEditable ||
            e.ctrlKey || e.altKey || e.metaKey) {
            success = false;
        } else if (e.shiftKey && e.keyCode == 32) { // Shift + Space Key
            success = scrollUp();
        } else if (e.keyCode == 32) { // Space key
            success = scrollDown();
        }
        if (success) e.preventDefault();
    });

    function scrollDown() {
        return scrollTo(selectDestination(0.5, true));
    }

    function scrollUp() {
        if ($cover.css('height').indexOf('0') !== 0) {
            if ($topElement.scrollTop() > 0) {
                return scrollTo(selectDestination(0.5, false));
            } else {
                clearCover();
                return true;
            }
        } else {
            return false;
        }
    }

    function scrollTo($target) {
        if ($target) {
            $cover.css('height', $target.offset().top / $topElement.css('zoom')); // $cover は $topElement 直下なので、$topElement 以外の zoom の影響は受けない
            $topElement.animate({
                scrollTop: $target.offset().top
            }, {
                queue: false
            });
            return true;
        }
        return false;
    }

    function selectDestination(border, isDown) {
        var $inArea = selectInArea(border, isDown);
        var $header = selectHeader($inArea);
        var $largest = selectLargest($header);
        return $largest;
    }

    function selectInArea(border, isDown) {
        var screenHeight = window.innerHeight ? window.innerHeight : $(window).height(); // $(window).height() は Chrome ではてなブックマークなどを見ると異常値になるため
        var offsetScreenTop = $topElement.scrollTop();
        var offsetScreenBottom = offsetScreenTop + screenHeight;
        var offsetBorder = offsetScreenTop + screenHeight * border;
        var $inArea = $topElement.find('*:not(nav *, aside *, [role="navigation"] *, [role="contentinfo"] *, [role="complementary"])').filter(function() {
            var top = $(this).offset().top;
            if (isDown) {
                // below border, above bottom
                return offsetBorder < top && top < offsetScreenBottom;
            } else {
                // below top, above border, previous screen
                return offsetScreenTop - screenHeight < top && top < offsetBorder - screenHeight;
            }
        });
        return $inArea;
    }

    function selectHeader($list) {
        var headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        for (var i=0; i<6; ++i) {
            var $h = $list.filter(headers[i]);
            if ($h.size() > 0) return $h;
        }
        return $list;
    }

    function selectLargest($list) {
        var largestIndex = -1;
        var largestSize = 0;

        $list.each(function(index) {
            var size = $(this).width() * $(this).height();
            if (largestSize < size) {
                largestIndex = index;
                largestSize = size;
            }
        });

        if (largestIndex == -1) {
            return false;
        } else {
            return $list.eq(largestIndex);
        }
    }

    function clearCover() {
        $cover.css('height', 0);
    }
});
})(jQuery);
