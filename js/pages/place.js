(function($){
    $(document).ready(function(){
        $("#paymentType").selectmenu({
            change: function(e, data) {
                console.log("validating " + data, e)
            }
        });
        $("#pickupTime").selectmenu({
            change: function(e, data) {
                console.log("validating " + data, e)
            }
        });
    });
})(jQuery);