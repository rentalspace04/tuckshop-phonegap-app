(function($){

    function validateItemJSON(json) {
        return new Promise((resolve, reject) => {
            if (!(json.hasOwnProperty("auth") && json.auth)) {
                reject(new AuthError("User is not authorised for getCategories.", json));
            }
            if (!json.hasOwnProperty("item")) {
                reject(new Error("server returned no categories"));
            }
            resolve(json);
        });
    }

    function makeCartTable() {
        var cart = getCartFromStorage();
        var td = new TuckshopData(storage.getUserID(), storage.getToken());
        if (cart.isEmpty()) {
            return $("<p>").text("You don't have anything in your cart!");
        } else {
            var table = $("<table>").attr("id", "cartView").append(
                $("<thead>").append(
                    $("<tr>").append(
                        $("<th>").text("Item"),
                        $("<th>").text("Quantity"),
                        $("<th>").text("Price")
                    )
                ),
                $("<tbody>")
            );

            console.log("cart is", cart);

            cart.each((itemPair) => {
                var itemID = itemPair.key;
                var quantity = itemPair.value;

                console.log(itemID, quantity);

                td.getItem(itemID)
                .then(validateItemJSON)
                .then((json) => {
                    // Pass the quantity along as well
                    return {
                        "item": json.item,
                        "quantity": quantity
                    };
                })
                .then(addItemToCartView)
                .catch(handlePromiseError);
            });

            return table;
        }
    }

    function itemCartViewRow(item, quantity) {
        var totalPrice = item.price * quantity;
        return $("<tr>").append(
            $("<td>").text(item.name),
            $("<td>").text(quantity),
            $("<td>").text("$" + totalPrice.toFixed(2))
        );
    }

    function addItemToCartView(itemAndQuanity) {
        var item = jsonToItem(itemAndQuanity.item);
        var quantity = itemAndQuanity.quantity;

        var itemRow = itemCartViewRow(item, quantity);

        $("#cartView tbody").append(itemRow);
    }

    function displayCart() {
        var cartTable = makeCartTable();

        $("#cartViewContainer").append(cartTable);
    }

    $(document).ready(function(){
        displayCart();
    });
})(jQuery);