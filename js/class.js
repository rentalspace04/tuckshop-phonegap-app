

/*
*     Parses a JSON object and returns the cart object it represents
*/
function jsonToCart(json) {
    var newCart = new Cart();
    if (json && json.hasOwnProperty("items")) {
        var items = json["items"];
        for (var item in items) {
            newCart.add(item, items[item]);
        }
    }
    return newCart;
}

/*
*    Gets the cart stored in the PHP session
*    Parses the json returned in the request and puts it in the cart
*    variable
*/
function getCart(callback = null) {
    new Ajax.Request("/data/getCart.php", {
        method: "get",
        onSuccess: function (resp) {
            var json = resp.responseJSON;
            if (json) {
                cart = jsonToCart(json);
            } else {
                // Something went wrong
                console.log("Something went wrong while updating cart... Response was:");
                console.log(resp.responseText);
            }
            if (callback) {
                callback();
            }
        }
    });
}

/*
*    Lets the server know about changes/updates to the cart model
*/
function updateCart(callback = null) {
    console.log("JSON", Object.toJSON(cart));

    // Tell server what's in our cart
    new Ajax.Request('/data/updateCart.php', {
        method: "post",
        parameters: {
            cartState: Object.toJSON(cart)
        },
        onSuccess: function (resp) {
            // Check that the cart was updated successfully
            var json = resp.responseJSON;
            if (json) {
                if (json.hasOwnProperty("success") && json["success"]) {
                    // It was all good
                } else {
                    console.log(json);
                }
            } else {
                console.log(resp.responseText);
            }
            if (callback) {
                callback();
            }
        }
    });
}

/*
*    Gets the menu (that is, the set of items in the selected category)
*/
function getMenu(category, callback = null) {
    new Ajax.Request("/data/getItem.php", {
        method: "get",
        parameters: {
            categoryID: category,
        },
        onSuccess: function (resp) {
            if (resp.responseJSON) {
                oldMenu = menu; // backup old menu
                menu = jsonToMenu(resp.responseJSON);
            } else {
                console.log("Failure with AJAX request to getItems");
                console.log(resp);
            }
            if (callback) {
                callback();
            }
        }
    });
}

// Global variables
// -- Empty cart and menu to start with
var cart = new Cart();
var menu = new Array();
var oldMenu = menu;