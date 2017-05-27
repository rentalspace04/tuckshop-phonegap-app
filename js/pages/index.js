(function($){

    function checkGiven(selector) {
        var given = $(selector).val() != "";
        if (!given) {
            $(selector).addClass("error");
            // Should remove error w/ focus and change (i.e. user is trying
            // to fix error, so don't tell them anymore)
            addRemoveErrorListeners(selector);
        }
        return given;
    }

    function addRemoveErrorListeners(selector) {
        $(selector).on("focus", () => {
            $(selector).removeClass("error");
        });
        $(selector).on("change", () => {
            $(selector).removeClass("error");
        });
    }

    function showWarning(msg) {
        $("#errorMessage").text(msg).slideDown(200);
    }

    function hideWarning() {
        $("#errorMessage").slideUp(200);
    }

    function validateLoginJSON(json) {
        return new Promise((resolve, reject) => {
            console.log(json);
            if (!json.hasOwnProperty("auth")) {
                console.log("no auth");
                reject(new Error("Server responded incorrectly."));
            }
            if (!json.auth) {
                reject(new Error("Invalid email/password combo."));
            }
            if (!jsonHasProperties(json, ["userID", "token"])) {
                console.log("no userid/token");
                reject(new Error("Server responded incorrectly."));
            }
            resolve(json);
        });
    }

    function catchJSONError(err) {
        // There was a problem with getting or validating the JSON
        console.warn(err);
        var message = err.message;
        if (!message) {
            message = "There was a problem while trying to log in. Please try again soon.";
        }
        showWarning(message);
    }

    $(document).ready(function(){
        var storage = new Storage();
        if (storage.isLoggedIn()) {
            window.location.href = "/home.html";
        }

        $("#loginButton").on("click", function(e){
            e.preventDefault(); // stop default form submit action
            hideWarning();
            if (checkGiven("#email") && checkGiven("#password")) {
                var email = $("#email").val();
                var password = $("#password").val();
                var td = new TuckshopData();
                td.logIn(email, password)
                .then(validateLoginJSON)
                .then((json) => {
                    // Store the log in details and go to home page
                    storage.logIn(json.userID, json.token);
                    setTimeout(() => {
                        window.location.href = "home.html";
                    }, 500);
                })
                .catch(catchJSONError);
            }
            // var s = new Storage();
            // s.logIn(10, "asdonasidna");
            // setTimeout(function(){
            //     window.location.href = "home.html";
            // }, 1000);
        });
    });
})(jQuery);