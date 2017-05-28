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
    }

    function addCategoryToList(cat) {
        $("#categoryMenu ul").append(
            $("<li></li>")
            .attr("data-category-id", cat.categoryID)
            .text(cat.name)
        );
    }

    function handleError(err) {
        if (err instanceof AuthError) {
            performLogOut();
        } else {
            console.log("Error caught - not an auth error.");
            console.warn(err);
        }
    }

    function makeTuckshopData() {
        var storage = new Storage();
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
        .catch(handleError);
    }

    function loadMenu(categoryID) {
        console.log("getting menu");
        var td = makeTuckshopData();
        td.getMenu(categoryID)
        .then(validateMenuJSON)
        .then(displayMenu)
        .catch(handleError);
    }

    $(document).ready(function(){
        $("#categoryMenu img").on("click", function(e){
            $("#categoryMenu").toggleClass("open", 500);
        });

        $(document).on("click", function(e){
            if (!$.contains($("#categoryMenu").get(0), e.target)) {
                $("#categoryMenu").removeClass("open", 500);
            }
        });

        var item = new Item(1, "item", "it's an item.", 10, 1.50,
            "/img/default_thumb.png", [1, 2]);
        $("#menuList").append($(item.asHTML()));
        $("#menuList").append($(item.asHTML()));
        $("#menuList").append($(item.asHTML()));
    });

    confirmUserIsLoggedIn();
    loadCategories();
    loadMenu(0); // Load all categories first
})(jQuery);