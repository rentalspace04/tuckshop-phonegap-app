(function($){
    $(document).ready(function(){
        $("#logoutButton").on("click", function(e){
            var s = new Storage();
            s.logOut();
            setTimeout(function(){
                window.location.href = "index.html";
            }, 1000);
        });
    });
})(jQuery);