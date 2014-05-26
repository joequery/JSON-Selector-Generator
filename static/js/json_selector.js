// ===================================================
// DOM Outline with event handlers
// ===================================================
$(function(){
    var $selector_box = $("#selector");
    var selector_val = "";

    var DomOutlineHandlers = {
        'click': function(e){
            selector_val = $(e).data('json-selector');
            $selector_box.val(selector_val);
        },
        'mouseover': function(e){
            $(".DomOutline").show();
        },
        'mouseout': function(e){
            $(".DomOutline").hide();
        },
    }
    var DOutline = DomOutline({
        handlers: DomOutlineHandlers,
        filter: 'code span:not(.hljs-attribute)'
    })
    DOutline.start()
});
