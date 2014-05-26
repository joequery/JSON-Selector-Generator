// ===================================================
// Home page sample data
// ===================================================
$(function(){
    var $sampledata_btn = $("#get_example");
    $sampledata_btn.click(function(){
        $sampledata_btn.text("Now click 'process' below...");
        $sampledata_btn.attr("disabled", "disabled");
        $sampledata_btn.removeClass("btn-primary");

        var jqxhr = $.getJSON('/sampledata',
            function(resp, status) {
                rawjson = resp.rawjson;
                $("#rawjson").text(rawjson);
            }
        );
    });
});
