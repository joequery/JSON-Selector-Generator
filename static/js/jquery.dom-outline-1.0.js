/**
 * A fork of jQuery.DomOutline with some modifications:
 *
 * 1. Arbitrary event handlers
 * 2. Removed the label around the border
 * 3. Some cosmetic code changes
 */
var DomOutline = function (options) {
    options = options || {};

    var pub = {};
    var self = {
        opts: {
            namespace: options.namespace || 'DomOutline',
            borderWidth: options.borderWidth || 2,
            handlers: options.handlers || false,
            filter: options.filter || false
        },
        active: false,
        initialized: false,
        elements: {}
    };

    function writeStylesheet(css) {
        var element = document.createElement('style');
        element.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(element);

        if (element.styleSheet) {
            element.styleSheet.cssText = css; // IE
        } else {
            element.innerHTML = css; // Non-IE
        }
    }

    function initStylesheet() {
        if (self.initialized !== true) {
            var css = '' +
                '.' + self.opts.namespace + ' {' +
                '    background: #09c;' +
                '    position: absolute;' +
                '    z-index: 1000000;' +
                '}' +
                '.' + self.opts.namespace + '_label {' +
                '    background: #09c;' +
                '    border-radius: 2px;' +
                '    color: #fff;' +
                '    font: bold 12px/12px Helvetica, sans-serif;' +
                '    padding: 4px 6px;' +
                '    position: absolute;' +
                '    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);' +
                '    z-index: 1000001;' +
                '}';

            writeStylesheet(css);
            self.initialized = true;
        }
    }

    function createOutlineElements() {
        self.elements.top = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
        self.elements.bottom = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
        self.elements.left = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
        self.elements.right = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
    }

    function removeOutlineElements() {
        jQuery.each(self.elements, function(name, element) {
            element.remove();
        });
    }

    function getScrollTop() {
        if (!self.elements.window) {
            self.elements.window = jQuery(window);
        }
        return self.elements.window.scrollTop();
    }

    function updateOutlinePosition(e) {
        if (e.target.className.indexOf(self.opts.namespace) !== -1) {
            return;
        }
        if (self.opts.filter) {
            if (!jQuery(e.target).is(self.opts.filter)) {
                return;
            }
        }
        pub.element = e.target;

        var b = self.opts.borderWidth;
        var scroll_top = getScrollTop();
        var pos = pub.element.getBoundingClientRect();
        var top = pos.top + scroll_top;

        var label_top = Math.max(0, top - 20 - b, scroll_top);
        var label_left = Math.max(0, pos.left - b);

        self.elements.top.css({
            top: Math.max(0, top - b),
            left: pos.left - b,
            width: pos.width + b,
            height: b
        });
        self.elements.bottom.css({
            top: top + pos.height,
            left: pos.left - b,
            width: pos.width + b,
            height: b
        });
        self.elements.left.css({
            top: top - b,
            left: Math.max(0, pos.left - b),
            width: b,
            height: pos.height + b
        });
        self.elements.right.css({
            top: top - b,
            left: pos.left + pos.width,
            width: b,
            height: pos.height + (b * 2)
        });
    }

    function bind_event(event_type) {
        if (!self.opts.handlers.hasOwnProperty(event_type)){
            return;
        }
        jQuery('body').on(event_type +'.'+ self.opts.namespace, function(e){
            if (self.opts.filter && !jQuery(e.target).is(self.opts.filter))
                return false;

            // I can't explain why this has to happen...but...if we
            // don't, if the very first action is a mouseover,
            // pub.element is undefined.
            if(!pub.element){
                updateOutlinePosition(e);
            }
            self.opts.handlers[event_type](pub.element);
        });
    }

    pub.start = function () {
        initStylesheet();
        if (self.active !== true) {
            self.active = true;
            createOutlineElements();
            jQuery('body').on('mousemove.' + self.opts.namespace, updateOutlinePosition);
            setTimeout(function () {
                for (var event_type in (self.opts.handlers || {})){
                    (function(event_type){
                        bind_event(event_type);
                    })(event_type);
                }
            }, 50);
        }
    };

    return pub;
};
