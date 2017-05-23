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