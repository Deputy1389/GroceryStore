/* script.js Authors: Oscar Cedano/Sean Gallagher
 * Inlcudes all of the scripts that are necessary to
 * run our website. Uses Ajax calls to get information
 * from the server.
 */

/* 
 * GENERAL INTERFACE FUNCTIONS START.
 *
 */

/* goBack() Authors: Oscar Cedano/Sean Gallagher --
 * Hides current menu and returns to specified menu.
 */
function goBack(menu){
    document.getElementById("categories").style.display="none";
    $("#productList").hide();
    $("#stockList").hide();
    $("#pastOrders").hide();
    $("#pastOrders").html("");
    $("#itemList").hide();
    $("#stats").hide();
    //$("#manStatsMenu").html("");
    if(menu=="main"){
        document.getElementById("mainMenu").style.display="block";
        $("#productCart").hide();
        $("#supplyProdCart").hide();
        $("#orderDetails").hide();
        $("#userList").hide();
        $("#manStatsMenu").hide();
    }
    if(menu=="cat"){
        $("#productList").html("");
        $("#categories").show();
    }
    if(menu=='manStatsMenu'){
        $("#categories").hide();
        $("#manStatsMenu").show();

    }
}

/* showMenuType(var) Authors: Oscar Cedano/Sean Gallagher --
 * Shows corresponding menu type depending on logged in user
 * type.
 */
function showMenuType(uType){
    if(uType == 'C')
        document.getElementById('custMenu').style.display = "block";
    else if(uType == 'E')
        document.getElementById('empMenu').style.display = "block";
    else if(uType == 'M')
        document.getElementById('manMenu').style.display = "block";
}

/* showSelected(var) Authors: Oscar Cedano/Sean Gallagher --
 * Hides Main Menu and shows the selected menu option.
 *
 */
function showSelected(option){
    if(option=="createOrder"){
        document.getElementById("mainMenu").style.display = "none";
        showCategories("getProductList");//populate categories
        document.getElementById("categories").style.display = "block";
        $("#productCart").show();
    }
    if(option=="pastOrders"){
        getOrderList();
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("pastOrders").style.display = "block";
    }
    if(option=="viewStock"){
        $("#mainMenu").hide();
        showCategories("getStockList");//populate categories
        $("#categories").show();
    }
    if(option=="createSuppOrder"){
        $("#mainMenu").hide();
        showCategories("getSupplyProdList");
        $("#categories").show();
        $("#supplyProdCart").show();
    }
    if(option=="supplyOrders"){
        getSupplyOrderList();
        $("#mainMenu").hide();
        $("#pastOrders").show();
    }
    if(option=="modStockInfo"){
        $("#mainMenu").hide();
        showCategories("getItemList");//populate categories
        $("#categories").show();
    }
    if(option=="manUsers"){
        getUserList();
        $("#mainMenu").hide();
        $("#userList").show();
    }
    if(option=="empStatistics"){
        query1();
        $("#mainMenu").hide();
    }
    if(option=="manStatistics"){
        $("#mainMenu").hide();
        query4();
    }
    if(option=="query3"){
        $("#manStatsMenu").hide();
        showCategories("query3");//populate categories
        $("#categories").show();
    }
}

/* showCategories(var) Authors:Oscar Cedano/Sean Gallagher --
 * Populates and displays the category options menu and 
 * prepares for selected menu option operation.
 */
function showCategories(operation){
    var categories = ["Dairy", "Refrigerated", "Meats", "Vegetables", "Cooking", "Frozen", "Soft Drinks", "Prepared Meals", "Pharmacy", "Helicopters"];

    var table = "<label class='chartL'>Product Categories</label>";
    table += "<table class='catTable'>";
    table += "<table class=\"catTable\">";
    var j = 0;
    for(var i = 0; i <categories.length/2; i++){
        table += "<tr>";
        for(var k = 0; k < 2; k++){
            table += " <td class = \"buttTd\"><button type=\"button\" class=\"menuButt\" onclick=\""+operation+"('"+ categories[j] +"')\">"+categories[j]+"</button></td>";
            j++;
        }
        table += "</tr>";
    }
    table += "<tr>";
    if(operation == 'query3')
        table += "<td class = \"buttTd\"><button type=\"button\" class=\"menuButt back\" style=\"margin-left:200px\" onclick=\"goBack('manStatsMenu')\">Go back</button></td>";
    else
        table += "<td class = \"buttTd\"><button type=\"button\" class=\"menuButt back\" style=\"margin-left:200px\" onclick=\"goBack('main')\">Go back</button></td>";
    table += "</tr>";
    table += "</table>";
    $("#categories").html(table);
}

/* 
 * GENERAL INTERFACE FUNCTIONS END.
 *
 */

/* 
 * CUSTOMER MENU FUNCTIONS START.
 *
 */


var isOOS = null;//bool to hold whether item's out of stock or not
/* getProductList(var) Authors: Oscar Cedano/Sean Gallagher --
 * Uses an AJAX call to connect to the backend DB and get a list
 * of products depending on the specified category.
 */
function getProductList(category){
    $("#categories").hide();
    $.ajax({
        url:"getProducts.jsp",
        type:"post",
        data: {"cat" : category},
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header green'>";
            table += "<div class ='cell'>Product Name</div><div class ='cell'>Description</div><div class='cell'>Price</div><div class='cell'></div>";
            table +="</div>";
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    isOOS = (resp[i][3] <= 0);//set isOOS
                    if(j!=0 && j !=3 && j!=5 && j!=6){
                        if(j==4){//parse price to money format
                            var price = parseFloat(resp[i][j]);
                            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                        }
                        else
                            table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                    }
                }
                //check if OOS
                if(!isOOS){
                    table += "<div class='cell'><button type='button' id='stockButt"+resp[i][0]+"' class='cartButt' onclick=\"addToCart("+resp[i][0]+",'"+resp[i][1]+"',"+resp[i][4]+","+resp[i][3]+")\">Add to Cart</button></div>";
                }else
                    table += "<div class='cell'><button type='button' class='cartButt' style='background-color:red'>OUT OF STOCK</button></div>";
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('cat')\">Go back</button>";
            $("#productList").html(table);
            $("#productList").show();//show after population completed
        }
    })
}


var cartArray = new Array();//array to hold cart product itemIDs
/* addToCart(var,var,var,var) Authors: Oscar Cedano/Sean Gallagher --
 * Adds the selected item to the users shopping cart and displays a table
 * with the current items on the cart. Also gives an option to complete order.
 * Checks stock quantity for items out of stock at each click.
 */
function addToCart(itemID, name, price, inStock){
    $("#productCart").show();//show shopping cart

    //check if qty in stock is greater than 0
    //make new product object if added item not in cart
    if(!inCart(itemID)){
        var productObj = {};
        productObj["itemID"] = itemID;
        productObj["name"] = name;
        productObj["qty"] = 1;
        productObj["price"] = price;
        productObj["inStock"] = inStock;
        productObj["initInStock"] = inStock;
        cartArray.push(productObj);//push into cart array
    }

    var table = "<label class='chartL'>Shopping Cart</label>";
    table += "<div class='prettyTable'>";
    table += "<div class='row header'>";
    table += "<div class='cell'>Product Name</div><div class='cell'>Qty</div><div class='cell'>$Total</div>";
    table += "</div>";
    for(var i = 0; i < cartArray.length; i++){
        table += "<div class ='row'>";
        table += "<div class ='cell'>" + cartArray[i]["name"] + "</div>";
        table += "<div class ='cell'>" + cartArray[i]["qty"] + "</div>";
        //parse item total to money format
        var price = cartArray[i]["price"] * cartArray[i]["qty"];
        table += "<div class ='cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
        table += "</div>";
    }
    table += "<div class='row' style='border-top:solid'>";
    table += "<div class ='cell'><button type='button' class='cartButt' style='background-color:red' onclick='cancelOrder()'>Cancel Order</button></div>";
    table += "<div class ='cell'><button type='button' class='cartButt' style='background-color:#27ae60' onclick='submitOrder()'>Make Order</button></div>";
    table += "<div class='cell'>$" + getOrderTotal().toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
    table += "</div>";
    table += "</div>";
    $("#productCart").html(table);//redraw cart
}

/* inCart(var) Authors: Oscar Cedano/Sean Gallagher --
 * Returns true if the item with inputted itemID is already
 * in the shopping cart. False otherwise. It also increments
 * the quantity attribute of the item if it's already in cart.
 * Finally decrements inStock attribute if already in cart.
 */
function inCart(itemID){
    for(var i = 0; i < cartArray.length; i++){
        if (cartArray[i]["itemID"] == itemID){
            cartArray[i]["inStock"]--;//decrement inStock qty

            if(cartArray[i]["inStock"] <= 0){//if less or equal to zero
                isOOS = true;//set to out of stock

                //redraw add to cart button to out of stock
                $("#stockButt"+itemID).html("OUT OF STOCK");
                $("#stockButt"+itemID).attr("onClick", null);
                $("#stockButt"+itemID).css("background-color","red");

                return true;
            }else{
                cartArray[i]["qty"]++;
                return true;
            }
        }
    }
    return false;
}

/* setStockQty(var, var) Authors: Oscar Cedano/Sean Gallagher --
 * Sets the inStock attribute of input object only if it's the
 *
 */

/* getOrderTotal() Authors: Oscar Cedano/Sean Gallagher --
 * Iterates through cart array and returns the grand
 * order total.
 */
function getOrderTotal(){
    var total = 0;
    for(var i = 0; i < cartArray.length; i++){
        total += cartArray[i]["qty"] * cartArray[i]["price"];
    }
    return total;
}

/* submitOrder(var) Authors: Oscar Cedano/Sean Gallagher --
 * Submits the order currently in cart by making an AJAX call to
 * submitOrder.jsp file that will submit the order to our DB.
 * Looks at our global cart array to get items in cart.
 */
function submitOrder(){
    if(confirm("Are you sure you want to proceed?")){
        $.ajax({
            url:"submitOrder.jsp",
            type:"post",
            data:{"cartArray" : JSON.stringify(cartArray),
                  "orderTotal": getOrderTotal(),
                  "orderType" : "C"},
            success: function(resp){
                if(resp != -1){
                    cartArray =[];
                    location.reload(true);
                    alert("Order Submitted Successfully!");
                }
                else
                    alert("Order submission failed. Try again later.")
            }
        })
    }
}

/* cancelOrder() Authors: Oscar Cedano/Sean Gallagher --
 * Clears current unsubmitted order when user selects
 * this option.
 */
function cancelOrder(){
    //redraw add to cart buttons
    for(var i = 0; i < cartArray.length; i++){
        //restore stock info
        cartArray[i]["inStock"] = cartArray[i]["initInStock"];
        //redraw add to cart button
        $("#stockButt"+cartArray[i]["itemID"]).attr("onClick", "addToCart("+cartArray[i]["itemID"]+",'"+cartArray[i]["name"]+"',"+cartArray[i]["price"]+","+cartArray[i]["inStock"]+")");
        $("#stockButt"+cartArray[i]["itemID"]).html("Add to Cart");
        $("#stockButt"+cartArray[i]["itemID"]).css("background-color","dodgerblue");
    }
    //empty and redraw cart
    cartArray = [];
    $("#productCart").html("");
}

/* getOrderList() Authors: Oscar Cedano/Sean Gallagher --
 * Gets the list of past orders using the userID associated to
 * the current user in session and populates a table holding the orders.
 */
function getOrderList(){
    $.ajax({
        url:"getOrders.jsp",
        type:"post",
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header green'>"
            table += "<div class ='cell'>Order Date</div><div class ='cell'>Pickup Date</div><div class='cell'>$Total</div><div class='cell'></div>";
            table +="</div>"
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j!=0 && j !=1 && j!=5){
                        if(resp[i][j] == null){//change text to inStore trans
                            resp[i][j] = "In-Store Order";
                        }
                        if(j==4){//parse price to money format
                            var price = parseFloat(resp[i][j]);
                            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                        }
                        else
                            table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                    }
                }
                table += "<div class='cell'><button type='button' class='cartButt' onclick=\"getOrderItems("+resp[i][0]+", 'C')\">Details</button></div>";
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('main')\">Go back</button>";
            $("#pastOrders").html(table);
        }
    })
}

/* getOrderItems(var) Authors: Oscar Cedano/Sean Gallagher --
 * Retrieves the items that belong to a specific order and 
 * displays them as a table when user selects to see order
 * details. Checks if supply or customer order to display
 * right price.
 */
function getOrderItems(orderID, orderType){
    $.ajax({
        url:"getOrderItems.jsp",
        type:"post",
        data: {"orderID": orderID,
               "orderType": orderType},
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header'>";
            table += "<div class='cell'>Product Name</div><div class='cell'>Qty</div><div class='cell'>$Total</div>";
            table += "</div>";
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j==2){//parse price to money format
                        var price = parseFloat(resp[i][j]);
                        table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                    }
                    else
                        table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                }
                table += "</div>";
            }
            table += "</div>";
            $("#orderDetails").html(table);//redraw cart
            $("#orderDetails").show();
        }
    })
}


/* 
 * CUSTOMER MENU FUNCTIONS END.
 *
 */

/* 
 * EMPLOYEE/MANAGER MENU FUNCTIONS START.
 *
 */

/* validateUser(var,var) Authors: Oscar Cedano/Sean Gallagher --
 * Validates inputted customer username by making user the
 * input field is not empty and also doing an ajax call to
 * verify the username corresponds to any user in the DB. After
 * validating, it then calls the selected menu option.
 */
function validateUser(option, textID){
    var obj = document.getElementById(textID);
    if (obj.checkValidity() == false) {
        $("#"+textID).attr("placeholder", obj.validationMessage);//check not empty
    } else {
        $.ajax({
            url:"checkUserExists.jsp",
            type:"post",
            dataType: "json",
            data: {"username": $("#"+textID).val()},
            success: function(resp){
                if(resp != -1){
                    if(resp[3] == "C"){
                        //set custID session variable
                        $.ajax({
                            url:"setCustID.jsp",
                            type:"post",
                            data:{"custID": resp[0]},
                            success: function(resp){
                                showSelected(option);
                            }
                        })

                    }
                    else{
                        $("#"+textID).val('');
                        $("#"+textID).attr("placeholder", "User must be a customer.");
                    }
                }
                else{
                    $("#"+textID).val('');
                    $("#"+textID).attr("placeholder", "User not found. Try again.");
                }

            }
        })
    } 
}

/* getStockList(var) Authors: Oscar Cedano/Sean Gallagher --
 * Gets the current stock information for the selected
 * category and displays it as a table.
 */
function getStockList(category){
    $("#categories").hide();
    $.ajax({
        url:"getProducts.jsp",
        type:"post",
        data: {"cat" : category},
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header' style='background-color:goldenrod'>"
            table += "<div class ='cell'>Product Name</div><div class ='cell'>Description</div><div class='cell'>Qty in Stock</div><div class='cell'>Price</div>";
            table +="</div>"
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j!=0 && j!=5 && j!=6){
                        if(j==4){//parse price to money format
                            var price = parseFloat(resp[i][j]);
                            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                        }
                        else
                            table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                    }
                }
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('cat')\">Go back</button>";
            $("#stockList").html(table);
            $("#stockList").show();//show after population completed
        }
    })
}


/* 
 * EMPLOYEE/MANAGER MENU FUNCTIONS END.
 *
 */

/* 
 * MANAGER MENU FUNCTIONS START.
 *
 */
/* getSupplyProdList(var) Authors: Oscar Cedano/Sean Gallagher --
 * Uses an AJAX call to connect to the backend DB and get a list
 * of stock products depending on the specified category.
 */
function getSupplyProdList(category){
    $("#categories").hide();
    $.ajax({
        url:"getProducts.jsp",
        type:"post",
        data: {"cat" : category},
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header' style='background-color:black'>";
            table += "<div class ='cell'>Product Name</div><div class='cell'>Supply Price</div><div class='cell'></div>";
            table +="</div>";
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j!=0 && j !=2 && j !=3 && j!=4 && j!=6){
                        if(j==5){//parse price to money format
                            var price = parseFloat(resp[i][j]);
                            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                        }
                        else
                            table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                    }
                }
                table += "<div class='cell'><button type='button' class='cartButt' onclick=\"addToSupplyCart("+resp[i][0]+",'"+resp[i][1]+"',"+resp[i][5]+")\">Add to Cart</button></div>";
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('cat')\">Go back</button>";
            $("#productList").html(table);
            $("#productList").show();//show after population completed
        }
    })
}

var supplyCartArray = new Array();//array to hold cart product itemIDs

/* addToSupplyCart(var,var,var) Authors: Oscar Cedano/Sean Gallagher --
 * Adds the selected item to the supply shopping cart and displays a table
 * with the current items on the cart. Also gives an option to complete and
 * cancel order.
 */
function addToSupplyCart(itemID, name, price){
    $("#supplyProdCart").show();//show shopping cart

    //make new product object if added item not in cart
    if(!inSupplyCart(itemID)){
        var productObj = {};
        productObj["itemID"] = itemID;
        productObj["name"] = name;
        productObj["qty"] = 1;
        productObj["price"] = price;
        supplyCartArray.push(productObj);//push into cart array
    }

    var table = "<label class='chartL'>Shopping Cart</label>";
    table += "<div class='prettyTable'>";
    table += "<div class='row header'>";
    table += "<div class='cell'>Product Name</div><div class='cell'>Qty</div><div class='cell'>$Total</div>";
    table += "</div>";
    for(var i = 0; i < supplyCartArray.length; i++){
        table += "<div class ='row'>";
        table += "<div class ='cell'>" + supplyCartArray[i]["name"] + "</div>";
        table += "<div class ='cell'>" + supplyCartArray[i]["qty"] + "</div>";
        //parse item total to money format
        var price = supplyCartArray[i]["price"] * supplyCartArray[i]["qty"];
        table += "<div class ='cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
        table += "</div>";
    }
    table += "<div class='row' style='border-top:solid'>";
    table += "<div class ='cell'><button type='button' class='cartButt' style='background-color:red' onclick='cancelSupplyOrder()'>Cancel Order</button></div>";
    table += "<div class ='cell'><button type='button' class='cartButt' style='background-color:#27ae60' onclick='submitSupplyOrder()'>Make Order</button></div>";
    table += "<div class='cell'>$" + getSupplyOrderTotal().toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
    table += "</div>";
    table += "</div>";
    $("#supplyProdCart").html(table);//redraw cart
}

/* inSupplyCart(var) Authors: Oscar Cedano/Sean Gallagher --
 * Returns true if the item with inputted itemID is already
 * in the supply shopping cart. False otherwise. It also increments
 * the quantity attribute of the item if it's already in cart.
 */
function inSupplyCart(itemID){
    for(var i = 0; i < supplyCartArray.length; i++){
        if (supplyCartArray[i]["itemID"] == itemID){
            supplyCartArray[i]["qty"]++;
            return true;
        }
    }
    return false;
}

/* getSuppyOrderTotal() Authors: Oscar Cedano/Sean Gallagher --
 * Iterates through supplycart array and returns the grand
 * order total.
 */
function getSupplyOrderTotal(){
    var total = 0;
    for(var i = 0; i < supplyCartArray.length; i++){
        total += supplyCartArray[i]["qty"] * supplyCartArray[i]["price"];
    }
    return total;
}

/* submitSupplyOrder(var) Authors: Oscar Cedano/Sean Gallagher --
 * Submits the order currently in supply cart by making an AJAX call to
 * submitOrder.jsp file that will submit the order to our DB.
 * Looks at our global supply cart array to get items in cart.
 */
function submitSupplyOrder(){
    if(confirm("Are you sure you want to proceed?")){
        $.ajax({
            url:"submitOrder.jsp",
            type:"post",
            data:{"cartArray" : JSON.stringify(supplyCartArray),
                  "orderTotal": getSupplyOrderTotal(),
                  "orderType" : "S",
                 },
            success: function(resp){
                if(resp != -1){
                    supplyCartArray =[];
                    location.reload(true);
                    alert("Order Submitted Successfully!");
                }
                else
                    alert("Order submission failed. Try again later.")
            }
        })
    }
}

/* cancelSupplyOrder() Authors: Oscar Cedano/Sean Gallagher --
 * Clears current unsubmitted supply order when user selects
 * this option.
 */
function cancelSupplyOrder(){
    supplyCartArray = [];
    $("#supplyProdCart").html("");
}

/* clearCustSesh(var) Authors: Oscar Cedano/Sean Gallagher --
 * Kills the custID session variable before performing manager
 * operations.
 */
function clearCustSesh(option){
    $.ajax({
        url:"killCustID.jsp",
        type:"post",
        success: function(resp){
            showSelected(option);
        }
    })
}

/* getOrderList() Authors: Oscar Cedano/Sean Gallagher --
 * Gets the list of past orders using the userID associated to
 * the current user in session and populates a table holding the orders.
 */
function getSupplyOrderList(){
    $.ajax({
        url:"getSupplyOrders.jsp",
        type:"post",
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header green'>"
            table += "<div class ='cell'>Order Date</div><div class='cell'>$Total</div><div class='cell'></div>";
            table +="</div>"
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j!=0 && j !=1 && j !=3 && j!=5){
                        if(j==4){//parse price to money format
                            var price = parseFloat(resp[i][j]);
                            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                        }
                        else
                            table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                    }
                }
                table += "<div class='cell'><button type='button' class='cartButt' onclick=\"getOrderItems("+resp[i][0]+",'S')\">Details</button></div>";
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('main')\">Go back</button>";
            $("#pastOrders").html(table);
        }
    })
}

/* getItemList(var) Authors: Oscar Cedano/Sean Gallagher --
 * Shows the list of all the items and the attributes a 
 * manager can decide to modify.
 */
function getItemList(category){
    $("#categories").hide();
    $.ajax({
        url:"getProducts.jsp",
        type:"post",
        data: {"cat" : category},
        dataType:"json",
        success: function(resp){
            var table = "Click on an item attribute to modify it";
            table += "<div id='itemTable' class='prettyTable'>";
            table += "<div class='row header' style='background-color:black'>";
            table += "<div class ='cell'>Item Name</div><div class ='cell'>Item Description</div><div class='cell'>Qty In Stock</div><div class='cell'>Price</div><div class='cell'>Supply Price</div><div class='cell'>Category</div><div class='cell'></div>";
            table +="</div>";
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j!=0){
                        if(j==5 || j==4 || j==3){//parse price to money format
                            var price = parseFloat(resp[i][j]);
                            table += "<div class = 'cell' id='"+resp[i][0]+"cell"+j+"'>";
                            if(j==3){
                                table += "<input type='number' id='"+resp[i][0]+"textCell"+j+"' style='display:none' min='0' required>";
                                table += "<label id='"+resp[i][0]+"lab"+j+"'>" + resp[i][j] + "</label>";
                            }else{
                                table += "<input type='number' step='any' id='"+resp[i][0]+"textCell"+j+"' style='display:none' min='0' required>";
                                table += "<label id='"+resp[i][0]+"lab"+j+"'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</label>";
                            }
                            table += "</div>";
                        }else if(j==6){
                            table += "<div class = 'cell'>";
                            table += "<label style='text-decoration:none; cursor:default; color:black'>" + resp[i][j] + "</label>";
                            table += "</div>";
                        }
                        else{
                            table += "<div class = 'cell' id='"+resp[i][0]+"cell"+j+"'>";
                            table += "<input type='text' id='"+resp[i][0]+"textCell"+j+"' style='display:none' required>";
                            table += "<label id='"+resp[i][0]+"lab"+j+"'>" + resp[i][j] + "</label>";
                            table += "</div>";
                        }
                    }
                }
                table += "<div class='cell'>";
                table += "<button type='button' id='"+resp[i][0]+"subButt' style='display:none' class='cartButt'>Submit Change</button>";
                table += "<button type='button' id='"+resp[i][0]+"delButt'  class='cartButt' style='background-color:red'>Delete</button>";
                table += "</div>";
                table += "</div>";
            }
            table += "<div class='row'>";
            table += "<div class='cell'><input type='text' id='textItemName' placeholder='Item Name' maxlength='20' required></div>";
            table += "<div class='cell'><input type='text' id='textItemDesc' placeholder='Item Description' maxlength='120' required></div>";
            table += "<div class='cell'><input type='number' id='textInStock' placeholder='Qty in Stock' min='0' required></div>";
            table += "<div class='cell'><input type='number' id='textPrice' placeholder='Price' step='any' min='0' required></div>";
            table += "<div class='cell'><input type='number' id='textSupplyPrice' placeholder='Supply Price' step='any' min='0' required></div>";
            table += "<div class='cell'></div>";
            table += "<div class='cell'><button type='button' style='vertical-align:middle' class='cartButt' onclick=\"checkItemInputSanity('"+category+ "')\">Add Item</button></div>";
            table+="</div>";
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('cat')\">Go back</button>";
            $("#itemList").html(table);
            $("#itemList").show();//show after population completed
        }
    })
}




var hiddenLabel;//to hold label to hid/show
var textBox;//to hold current textBox
var subButt;//submit changes button
var delButt;//delete item button
//function to hide and show using click event
$('html').click(function (e) {
    var patt = /[0-9]+lab[0-9]+/;
    var labelID = e.target.id.match(patt);
    if (e.target.id==labelID) {
        if(delButt != null)
            $("#"+delButt).show();
        if(subButt!=null)
            $("#"+subButt).hide();
        if (hiddenLabel!=null){
            $("#"+hiddenLabel).show();
            $("#"+textBox).hide(); 
        }
        hiddenLabel = labelID;
        $("#"+labelID).hide();
        var firstNum = e.target.id.match(/[0-9]+/);
        var lastNum = e.target.id.match(/[0-9]+/g)[1];
        textBox = firstNum+"textCell"+lastNum;
        $("#"+textBox).show().focus();
        subButt = firstNum + "subButt";
        $("#"+subButt).show();
        delButt = firstNum + "delButt"
        $("#"+delButt).hide();
    }else {
        //check if submit button is clicked
        if(e.target.id == subButt){
            var first = hiddenLabel.toString().match(/[0-9]+/g)[0];
            var snd = hiddenLabel.toString().match(/[0-9]+/g)[1];
            validateChange(first, snd);//pass in itemID, attr num and inputtext 
        }
        //check if delete button is clicked
        if(e.target.id.match(/[A-Za-z]+/) == 'delButt'){
            var itemID = e.target.id.match(/[0-9]+/g)[0];
            deleteItem(itemID);//pass in itemID of item to delete
        }
        else if("text" != e.target.type && "number" != e.target.type){
            $("#"+hiddenLabel).show();
            $("#"+textBox).hide(); 
            $("#"+subButt).hide();
            $("#"+delButt).show();
        }
    }
});


/* deleteItem(var) Authors: Oscar Cedano/Sean Gallagher --
 * Deletes the inputted user from our interface and DB.
 * Does an ajax call to server side JSP
 */
function deleteItem(itemID){
    if(confirm("Are you sure you want to proceed?")){
        $.ajax({
            url:"deleteItem.jsp",
            type:"post",
            data:{"itemID" : itemID
                 },
            success: function(){
                location.reload(true);
                alert("Item deleted successfully!");
            }
        })
    }
}


/* validateChange(var, var, var) Authors: Oscar Cedano/Sean Gallagher --
 * Checks whether the inputted change in stock info is valid and then
 * is stored in the DB.
 */
function validateChange(itemID, attrNum){
    var obj = document.getElementById(textBox);
    if (obj.checkValidity() == false) {
        alert(obj.validationMessage);//check not empty
    } else {
        if(confirm("Are you sure you want to proceed?")){
            var attrMap = ["","itemName", "itemDescription", "inStock", "price", "supplyPrice", "category"];
            $.ajax({
                url:"submitChange.jsp",
                type:"post",
                data:{"itemID": itemID,
                      "attr": attrMap[attrNum],
                      "newVal" : $("#"+textBox).val(),
                     },
                success: function(){
                    alert("Information updated successfully.");
                    hiddenLabel = null;
                    subButt = null;
                    textBox = null;
                    location.reload(true);
                }
            })
        }
    }
}

/* checkItemInputSanity(var) Authors: Oscar Cedano/Sean Gallagher --
 * Checks that the input information for new item registration
 * is valid and then calls a function to store it in DB.
 */
function checkItemInputSanity(category){
    //check input sanity
    var obj = document.getElementById("textItemName");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Item Name");
        return;
    }   
    obj = document.getElementById("textItemDesc");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Item Description");
        return;
    }   
    obj = document.getElementById("textInStock");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Qty In Stock");
        return;
    }   
    obj = document.getElementById("textPrice");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Price");
        return;
    }
    obj = document.getElementById("textSupplyPrice");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Supply Price");
        return;
    }    
    addNewItem(category);//green LIGHT
}

/* addNewItem(var) Authors: Oscar Cedano/Sean Gallagher --
 * Adds the input text new item information into the database
 * by making an ajax call.
 */
function addNewItem(category){
    if(confirm("Are you sure you want to proceed?")){
        $.ajax({
            url:"addItem.jsp",
            type:"post",
            data:{"itemName" : $("#textItemName").val(),
                  "itemDesc": $("#textItemDesc").val(),
                  "inStock" : $("#textInStock").val(),
                  "price" : $("#textPrice").val(),
                  "supplyPrice": $("#textSupplyPrice").val(),
                  "category" : category
                 },
            success: function(){
                location.reload(true);
                alert("Item added Successfully!");
            }
        })
    }
}

/* getUserList() Authors: Oscar Cedano/Sean Gallagher --
 * Gets a list of system users from the DB and displays it
 * as a table in our web interface.
 */
function getUserList(){
    $.ajax({
        url:"getUsers.jsp",
        type:"post",
        dataType:"json",
        success: function(resp){
            var typeMap = {C:"Customer",E:"Employee", M:"Manager", c:"Customer", e:"Employee", m:"Manager"};
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header'>"
            table += "<div class ='cell'>Username</div><div class ='cell'>Password</div><div class ='cell'>First Name</div><div class='cell'>Last Name</div><div class='cell'>User Type</div><div class='cell'></div>";
            table +="</div>"
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j!=0){
                        if(j==2)
                            table += "<div class = 'cell'>*******</div>";
                        else if(j==5)
                            table += "<div class = 'cell'>" + typeMap[resp[i][j]] + "</div>";
                        else
                            table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                    }
                }
                table += "<div class='cell'><button type='button' class='cartButt' style='background-color:red' onclick=\"deleteUser("+resp[i][0]+")\">Delete</button></div>";
                table += "</div>";
            }
            table += "<div class='row'>";
            table += "<div class='cell'><input type='text' id='textUser' placeholder='Username' maxlength='15' required></div>";
            table += "<div class='cell'><input type='password' id='textPW' placeholder='Password' maxlength='15' required></div>";
            table += "<div class='cell'><input type='text' id='textFName' placeholder='First Name' maxlength='20' required></div>";
            table += "<div class='cell'><input type='text' id='textLName' placeholder='Last Name' maxlength='20' required></div>";
            table += "<div class='cell'><input type='text' id='textUserType' placeholder='C, E or M' maxlength='1' required></div>";
            table += "<div class='cell'><button type='button' style='vertical-align:middle' class='cartButt' onclick=\"checkInputSanity()\">Add User</button></div>";
            table+="</div>";
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('main')\">Go back</button>";
            $("#userList").html(table);
        }
    })
}

/* checkInputSanity() Authors: Oscar Cedano/Sean Gallagher --
 * Checks that the input information for new user registration
 * is valid and then calls a function to store it in DB.
 */
function checkInputSanity(){
    //check input sanity
    var obj = document.getElementById("textPW");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Password");
        return;
    }   
    obj = document.getElementById("textFName");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": First Name");
        return;
    }   
    obj = document.getElementById("textLName");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Last Name");
        return;
    }   
    obj = document.getElementById("textUserType");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": User Type");
        return;
    }else{
        if(!['C','E', 'M'].includes(obj.value.toUpperCase())){
            alert("Invalid user type.")
            return;
        }     
    }   
    obj = document.getElementById("textUser");
    if(obj.checkValidity() == false){
        alert(obj.validationMessage + ": Username");
        return;
    }else{
        $.ajax({
            url:"checkUserExists.jsp",
            type:"post",
            data: {"username": obj.value},
            dataType:"json",
            success: function(resp){
                if(resp != -1){
                    alert("Username already exists.");
                    return;
                }
                addNewUser();//GREEN LIGHT. All Tests Passed.
            }
        })
    }
}

/* addNewUser() Authors: Oscar Cedano/Sean Gallagher --
 * Adds the input text new user information into the database
 * by making an ajax call.
 */
function addNewUser(){
    if(confirm("Are you sure you want to proceed?")){
        $.ajax({
            url:"addNewUser.jsp",
            type:"post",
            data:{"username" : $("#textUser").val(),
                  "password": $("#textPW").val(),
                  "fName" : $("#textFName").val(),
                  "lName" : $("#textLName").val(),
                  "userType": $("#textUserType").val()
                 },
            success: function(){
                location.reload(true);
                alert("User added Successfully!");
            }
        })
    }
}

/* deleteUser(var) Authors: Oscar Cedano/Sean Gallagher --
 * Deletes the inputted user from our interface and DB.
 * Does an ajax call to server side JSP
 */
function deleteUser(userID){
    if(confirm("Are you sure you want to proceed?")){
        $.ajax({
            url:"deleteUser.jsp",
            type:"post",
            data:{"userID" : userID
                 },
            success: function(){
                location.reload(true);
                alert("User deleted successfully!");
            }
        })
    }
}

/* 
 * MANAGER MENU FUNCTIONS END.
 *
 */

/*
 * QUERYING FUNCTIONS START.
 *
 */

/* query1() Authors: Oscar Cedano/Sean Gallagher --
 * Runs a query that displays the number of CUSTOMER orders
 * placed on the day the query is run.
 */
function query1(){
    $.ajax({
        url:"5queries.jsp",
        type:"post",
        data: {"option" : 1},
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";
            table += "<div class='row header'>"
            table += "<div class ='cell'>Number of Customer Orders placed Today.</div>";
            table += "</div>";
            table += "<div class = 'row'>";
            table += "<div class = 'cell'>" + resp[0][0] + "</div>";
            table += "</div>";
            table += "</div>";
            query2(table);//call query2 with first query as input
        }
    })
}

/* query2() Authors: Oscar Cedano/Sean Gallagher --
 * Runs a query that displays the top 10 customers based on
 * how much they have spent in total since the beginning of
 * times. Takes as input output from query1, and appends to it.
 */
function query2(table){
    $.ajax({
        url:"5queries.jsp",
        type:"post",
        data: {"option" : 2},
        dataType:"json",
        success: function(resp){
            table += "<div style='width:100%; background-color:#ea6153'>Top 5 all-time spending customers</div>";
            table += "<div class = 'prettyTable'>";    
            table += "<div class='row header'>";
            table += "<div class ='cell'>First Name</div><div class ='cell'>Last Name</div><div class='cell'>Price</div>";
            table +="</div>";
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    if(j==2){//parse price to money format
                        var price = parseFloat(resp[i][j]);
                        table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
                    }
                    else
                        table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                }
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('main')\">Go back</button>";
            $("#stats").html(table);
            $("#stats").show();
        }
    })
}

/* query3() Authors: Oscar Cedano/Sean Gallagher --
 * Runs a query that displays the total number of items
 * sold from the user selected category.
 */
function query3(category){
    $("#categories").hide();
    $.ajax({
        url:"5queries.jsp",
        type:"post",
        data: {"option" : 3,
               "category": category},
        dataType:"json",
        success: function(resp){
            var table = "<div class = 'prettyTable'>";    
            table += "<div class='row header'>";
            table += "<div class ='cell'>Product Name</div><div class='cell'>Quantity Sold</div>";
            table +="</div>";
            for(var i = 0; i < resp.length; i++){
                table += "<div class = 'row'>";
                for(var j = 0; j < resp[i].length; j++){
                    table += "<div class = 'cell'>" + resp[i][j] + "</div>";
                }
                table += "</div>";
            }
            table+="</div>";
            table+="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('cat')\">Go back</button>";
            $("#productList").html(table);
            $("#productList").show();
        }
    })
}

/* query4() Authors: Oscar Cedano/Sean Gallagher --
 * Runs a query that displays the average of today's
 * customer orders.
 */
function query4(){
    $.ajax({
        url:"5queries.jsp",
        type:"post",
        data: {"option" : 4},
        dataType:"json",
        success: function(resp){            
            var table = "<div class='cust' style='margin-bottom:20px'>";
            table += "<button type=\"button\" class=\"menuButt\"  onclick=\"showSelected('query3')\">Quantity of Items Sold</button>";
            table += "</div>";
            table += "<div class = 'prettyTable'>";
            table += "<div class='row header'>"
            table += "<div class ='cell'>Average of Today's Customer Orders.</div>";
            table += "</div>";
            table += "<div class = 'row'>";
            var price = parseFloat(resp[0][0]);
            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
            table += "</div>";
            table += "</div>";
            query5(table);//call query5 with first query as input
        }
    })
}

/* query5() Authors: Oscar Cedano/Sean Gallagher --
 * Runs a query that displays the total profit in dollars
 * made today from customer orders. Takes as input the 
 * output of query4 and appends its output to it.
 */
function query5(table){
    $.ajax({
        url:"5queries.jsp",
        type:"post",
        data: {"option" : 5},
        dataType:"json",
        success: function(resp){            
            table += "<div class = 'prettyTable'>";
            table += "<div class='row header'>"
            table += "<div class ='cell'>Profit Made From Today's Customer Orders</div>";
            table += "</div>";
            table += "<div class = 'row'>";
            var price = parseFloat(resp[0][0]);
            table += "<div class = 'cell'>$" + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</div>";
            table += "</div>";
            table += "</div>";
            table +="<button type=\"button\" class=\"menuButt back\" style='width:50%; margin-left:200px' onclick=\"goBack('main')\">Go back</button>";
            $("#manStatsMenu").html(table);
            $("#manStatsMenu").show();
        }
    })
}

/*
 * QUERYING FUNCTIONS END.
 *
 */


