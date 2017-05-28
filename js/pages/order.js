(function($){
    function validateCategoriesJSON(json) {
        return new Promise((resolve, reject) => {
            if (!(json.hasOwnProperty("auth") && json.auth)) {
                reject(new AuthError("User is not authorised for getCategories.", json));
            }
            if (!(json.hasOwnProperty("categories") && Array.isArray(json.categories))) {
                reject(new Error("server returned no categories"));
            }
            resolve(json);
        });
    }

    function validateMenuJSON(json) {
        return new Promise((resolve, reject) => {
            if (!(json.hasOwnProperty("auth") && json.auth)) {
                reject(new AuthError("User is not authorised for getItems.", json));
            }
            if (!(json.hasOwnProperty("items") && Array.isArray(json.items))) {
                reject(new Error("server returned no items"));
            }
            resolve(json);
        });
    }

    function displayCategories(json) {
        console.log("received categories");
        // Clear the category list
        $("#categoryMenu ul").empty();
        addCategoryToList({"name": "All Categories", "categoryID": 0})
        json.categories.each(addCategoryToList);
    }

    function displayMenu(json) {
        console.log("received menu");
        var menu = jsonToMenu(json);
        console.log(menu);
        $("#menuList").empty();
        menu.each((item) => {
            $("#menuList").append($(item.asHTML()));
        });
        // Register new click handlers for all the buttons
        registerQuantityButtons();
    }

    function addCategoryToList(cat) {
        $("#categoryMenu ul").append(
            $("<li></li>")
            .attr("data-category-id", cat.categoryID)
            .text(cat.name)
            .on("click", handleCategoryClicked)
        );
    }

    function handleCategoryClicked(e) {
        var catID = $(e.target).attr("data-category-id");
        loadMenu(catID);
    }

    function makeTuckshopData() {
        var userID = storage.getUserID();
        var token = storage.getToken();
        return new TuckshopData(userID, token);
    }

    function loadCategories() {
        console.log("getting categories");
        var td = makeTuckshopData();
        td.getCategories()
        .then(validateCategoriesJSON)
        .then(displayCategories)
        .catch(handlePromiseError);
    }

    function loadMenu(categoryID) {
        console.log("getting menu");
        var td = makeTuckshopData();
        td.getMenu(categoryID)
        .then(validateMenuJSON)
        .then(displayMenu)
        .then(closeCategoryMenu)
        .then(updateQuantities)
        .catch(handlePromiseError);
    }

    function closeCategoryMenu(e) {
        $("#categoryMenu").removeClass("open", 500);
    }

    function registerQuantityButtons() {
        $("div.menu-item .menu-add-button").on("click", handleAddButton);
        $("div.menu-item .menu-subtract-button").on("click", handleSubButton);
    }


    function getMenuItemID(target) {
        // gets list of items up until (but not incuding) the one we want
        var parents = $(target).parentsUntil("div.menu-item");
        return $(parents[parents.length - 1]).parent().attr("data-item-id");
    }

    function handleAddButton(e) {
        var cart = getCartFromStorage();

        // get item ID
        var itemID = getMenuItemID(e.target);

        // add one to cart
        cart.add(itemID);
        console.log(cart, itemID);

        // save cart to storage
        storage.updateCart(cart);

        // update quantities
        updateQuantities();
    }

    function handleSubButton(e) {
        var cart = getCartFromStorage();

        // get item ID
        var itemID = getMenuItemID(e.target);

        // add one to cart
        cart.remove(itemID);
        console.log(cart, itemID);

        // save cart to storage
        storage.updateCart(cart);

        // update quantities
        updateQuantities();
    }

    function updateQuantities() {
        var cart = getCartFromStorage();
        $(".menu-item").each((i, elem) => {
            var itemID = $(elem).attr("data-item-id");
            var quantity = 0;
            if (cart.has(itemID)) {
                quantity = cart.get(itemID);
            }
            var qInput = $(elem).find("input.menu-item-quantity-text");
            $(qInput).val(quantity);
        });
    }

    $(document).ready(function(){
        $("#categoryMenu img").on("click", function(e){
            $("#categoryMenu").toggleClass("open", 500);
        });

        $(document).on("click", function (e) {
            if (!$.contains($("#categoryMenu").get(0), e.target)) {
                closeCategoryMenu();
            }
        });
    });

    confirmUserIsLoggedIn();
    loadCategories();
    loadMenu(0); // Load all categories first
})(jQuery);