(function($){
    $(document).ready(function(){
        var storage = new Storage();
        if (storage.isLoggedIn()) {
            window.location.href = "/home.html";
        }

        $("#loginButton").on("click", function(e){
            var s = new Storage();
            s.logIn(10, "asdonasidna");
            setTimeout(function(){
                window.location.href = "home.html";
            }, 1000);
        });
    });
})(jQuery);