var Cart = Class.create({
    initialize: function() {
        this.items = new $H();
    },

    add: function(itemID, change = 1) {
        // If it's already in the item set, add the quantity
        var current = this.items.get(itemID);
        if (current) {
            this.items.set(itemID, current + change);
        } else {
            // Not in item set yet
            this.items.set(itemID, change);
        }
    },

    remove: function (itemID, change = 1) {
        // If it's already in the item set, sub the quantity
        var current = this.items.get(itemID);
        if (current) {
            var newQuantity = current - change;
            if (newQuantity <= 0) {
                this.items.unset(itemID);
            } else {
                this.items.set(itemID, newQuantity);
            }
        }
    },

    removeAll: function (itemID) {
        this.items.unset(itemID);
    },

    update: function(itemID, quantity) {
        if (quantity < 1) {
            this.removeAll(itemID);
            return;
        }
        this.items.set(itemID, quantity);
    },

    get: function(itemID) {
        var quantity = this.items.get(itemID);
        return quantity;
    },
    has: function(itemID) {
        return this.items.keys().indexOf(itemID) >= 0;
    },
    json: function() {
        return JSON.stringify(this);
    },
});

var Item = Class.create({
    initialize: function(itemID, name, desc, stock, price, image, categories) {
        this.itemID = itemID;
        this.name = name;
        this.desc = desc;
        this.stock = stock;
        this.price = price;
        this.image = image;
        this.categories = categories;
    },

    /*
    *    Puts a Menu Item section for this item into the menu list
    */
    asHTML: function() {
        var itemHTML = "<div class=\"menu-item\"\n>";
        itemHTML += "<img src=\"" + this.image + "\" />\n";
        itemHTML += "<table class=\"menu-item-content\">\n";
        itemHTML += "<tbody>\n<tr>\n<td>\n";
        itemHTML += this.name + "\n";
        itemHTML += "</td>\n<td>\n";
        itemHTML += "<p class=\"menu-item-price\">\$" + this.price.toFixed(2) + "</p>\n";
        itemHTML += "</td>\n</tr>\n<tr>\n<td>\n";
        itemHTML += "<p class=\"menu-item-desc\">" + this.desc +"</p>\n";
        itemHTML += "</td>\n<td>\n";
        itemHTML += "<div class=\"menu-item-quantity\" id=\"item-quantity-" + this.itemID + "\">\n";
        itemHTML += "<a class=\"menu-subtract-button\"><div>-</div></a>\n";
        itemHTML += "<input type=\"text\" class=\"menu-item-quantity-text\" disabled value=\"\" />\n";
        itemHTML += "<a class=\"menu-add-button\"><div>+</div></a>\n";
        itemHTML += "</div>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n";
        return itemHTML;
    }
});

var Storage = Class.create({
    initialize: function() {
        this.loggedIn = localStorage.getItem("loggedIn");
        if (this.loggedIn) {
            this.userID = localStorage.getItem("userID");
            this.token = localStorage.getItem("token");
            if (localStorage.getItem("ordering")) {
                cartJSON = localStorage.getItem("cart");
                cartPromise = cartFromJSON(cartJSON, isString(cartJSON));
                cartPromise.then((cart) => {
                    this.cart = cart;
                    this.ordering = true;
                }).catch(() => {
                    this.ordering = false;
                });
            }
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
    save: function() {
        localStorage.setItem("loggedIn", this.loggedIn);
        if (this.loggedIn) {
            localStorage.setItem("userID", this.userID);
            localStorage.setItem("token", this.token);
            if (this.ordering) {
                localStorage.setItem("cart", this.cart);
                localStorage.setItem("ordering", this.ordering);
            }
        }
    },
    logIn: function(userID, token) {
        this.userID = userID;
        this.token = token;
        this.loggedIn = true;
        this.save();
    },
    logOut: function() {
        localStorage.clear();
    },
    clearCart: function() {
        localStorage.removeItem("cart");
        localStorage.removeItem("ordering");
        this.cart = null;
        this.ordering = false;
    },
    updateCart: function(cart) {
        this.cart = cart;
        this.ordering = true;
        this.save();
    }
});

var TuckshopData = Class.create({
    initialize: function(token = null, userID = null) {
        this.baseURL = "https://infs3202-zwhqf.uqcloud.net";
        this.token = token;
        this.userID = userID;
    },
    get: function(url, params = {}) {
        if (this.token && this.userID) {
            setParamater(params, "token", this.token);
            setParamater(params, "userID", this.userID);
        }
        return new Promise((resolve, reject) => {
            new Ajax.Request(this.baseURL + url, {
                method: "post",
                parameters: params,
                onSuccess: (resp) => {
                    if (resp.responseJSON) {
                        resolve(resp.responseJSON);
                    }
                    reject(new Error(resp.responseText));
                },
                onFailure: (resp) => {
                    reject(new Error(resp.responseText));
                }
            });
        });
    },
    getItem: function(itemID) {
        return this.get("/mobile/getItem.php", {
            "itemID": itemID,
        });
    },
    getCategories: function() {
        return this.get("/mobile/getCategories.php", {});
    },
    getMenu: function(categoryID) {
        return this.get("/mobile/getMenu.php", {
            "categoryID": categoryID,
        });
    },
    logIn: function(email, password) {
        return this.get("/mobile/getToken.php", {
            "email": email,
            "password": password,
        });
    },
    getHistory: function() {
        return this.get("/mobile/getToken.php", {
            "email": email,
            "password": password,
        });
    }
});

/**
*
*        HELPER METHODS
*
*/

function arraysSame(a, b) {
    if (a == b) return true;
    if (a == null || b == null) return true;
    if (a.length != b.length) return false;
    var c = $A(a);
    var d = $A(b);
    c.each(function (elem, i) {
        if (elem != d[i]) {
            return false;
        }
    });
    return true;
}

// Checks if obj is a string
function isString(obj) {
    return typeof obj === "string" || obj instanceof String;
}

/*
*    Parses a JSON object and returns the array of menu items it
*    represents
*/
function jsonToMenu(json) {
    var itemsOut = new $A();

    json.items.each(function(i) {
        var item = new Item(i.itemID, i.name, i.description, i.availability, i.price, i.image, i.categories);
        itemsOut.push(item);
    });

    return itemsOut;
}

// Returns a promise that resolves to a cart item from the given json
// if the json is a valid cart
function cartFromJSON(json, isString = false) {
    // parse from string, if it's still a string, otherwise just return it
    var promise = new Promise((resolve, reject) => {
        if (isString) {
            resolve(JSON.parse(json));
        }
        resolve(json);
    });
    return promise.then((json) => {
        if (json.hasOwnProperty("items")) {
            var cart = new Cart();
            var map = $H(json.items);
            // Check that all item IDs are at least 0 and all values
            // are positive. Also, check that cart doesn't already have
            // entry for this item
            map.each((pair) => {
                if (Number.parseInt(pair.key) < 0
                    || Number.parseInt(pair.value) < 1
                    || cart.has(pair.key)) {
                    throw new Error("Invalid cart format");
                }
                cart.add(pair.key, pair.value);
            });
            return cart;
        }
        throw Error("Invalid cart format");
    });
}

function jsonHasProperties(json, props) {
    var out = true;
    var propsArr = $A(props);
    propsArr.each((elem) => {
        console.log(elem);
        out = out & json.hasOwnProperty(elem);
    });
    return out;
}

// Sets the an attribute of an object if it isn't already set
function setParamater(params, name, value) {
    if (!params.hasOwnProperty(name)) {
        params[name] = value;
    }
}