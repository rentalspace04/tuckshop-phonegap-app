(function($){
    $(document).ready(function(){
        $("#categoryMenu img").on("click", function(e){
            $("#categoryMenu").toggleClass("open", 500);
        });

        var item = new Item(1, "item", "it's an item.", 10, 1.50,
                "https://infs3202-zwhqf.uqcloud.net/img/default_thumb.png",
                [1, 2]);
        $("#menuList").append($(item.asHTML()));
        $("#menuList").append($(item.asHTML()));
        $("#menuList").append($(item.asHTML()));
    });
})(jQuery);