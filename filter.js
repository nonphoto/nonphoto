$('#digital').click(function() {
    $(this).toggleClass("active");
    $("#filterList li").show();
    $("#filterList li").not(".digital").hide();
});
$('#analogue').click(function() {
    $(this).toggleClass("active");
    $("#filterList li").show();
    $("#filterList li").not(".analogue").hide();
});
$('#both').click(function() {
    $(this).toggleClass("active");
    $("#filterList li").show();
});
