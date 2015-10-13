$("#digital").click(function() {
    $("#filter-buttons button").removeClass("selected");
    $(this).addClass("selected");
    $("#project-list li").show();
    $("#project-list li").not(".digital").hide();
});
$("#analogue").click(function() {
    $("#filter-buttons button").removeClass("selected");
    $(this).addClass("selected");
    $("#project-list li").show();
    $("#project-list li").not(".analogue").hide();
});
$("#both").click(function() {
    $("#filter-buttons button").removeClass("selected");
    $(this).addClass("selected");
    $("#project-list li").show();
});
