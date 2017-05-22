var Storage = Class.create({
    initialize: function() {
        this.loggedIn = localStorage.getItem("loggedIn") != null;
        if (this.initialized) {
            this.userID = localStorage.getItem("userID");
            this.token = localStorage.getItem("token");
        }
    },
    isLoggedIn: function() {
        return this.loggedIn;
    },
    getUserID: function() {
        return this.userID;
    },
    getToken: function() {
        return this.token;
    },
    updateStorage: function() {
        localStorage.setItem("loggedIn", this.loggedIn);
        localStorage.setItem("userID", this.userID);
        localStorage.setItem("token", this.token);
    },
    logIn: function(userID, token) {
        this.userID = userID;
        this.token = token;
        this.loggedIn = true;
        this.updateStorage();
    },
    logOut: function() {
        localStorage.clear();
    }
});

(function($){
    $(document).ready(function(){
        var storage = new Storage();
        if (storage.isLoggedIn()) {
            window.location.href = "/home.html";
        }

        $("#loginButton").on("click", function(e){
            console.log("hello");
            var s = new Storage();
            s.logIn(10, "asdonasidna");
            setTimeout(function(){
                window.location.href = "/home.html";
            }, 1000);
        });
    });
})(jQuery);