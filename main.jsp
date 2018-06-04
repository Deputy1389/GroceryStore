<!DOCTYPE html>
<!--main.jsp Authors: Oscar Cedano/Sean Gallagher --
Main Interface screen for our supermarket application.
Includes interfaces for all type of users. Mainly supported
by javascript calls that rewrite DOM from our HTML. Also
supported by JSP sessions which permit us to display information
for the currently logged in user.
-->
<html>
    <head>
        <title>Csc460 SuperMarket</title>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script type= text/javascript src="script.js"></script>
    </head>
    <body>
        <div id="mainMenu" class="centerBox">
            <%
               if(session.getAttribute("userID")==null)//redirect login if not logged in
                    response.sendRedirect("index.html");
               out.println("Welcome back " + session.getAttribute("fName") + "!");
               %>
                <div id="custMenu" style="display:none">
                    <div class="cust">
                        <button type="button" class="menuButt" onclick="showSelected('createOrder')"> Create Order</button>
                        <button type="button" class="menuButt" onclick="showSelected('pastOrders')" > View Past Orders</button>
                        <button type="button" id = "logOff" class = "menuButt" onclick="window.location='logoff.jsp'">
                            Log Off
                        </button>
                    </div>
                </div>
                <div id="empMenu"style="display:none">
                    <div class="custEmp">
                        <input type="text" id="userText1" placeholder="Enter Customer username." required> 
                        <button type="button" class="menuButt" onclick="validateUser('createOrder','userText1')"> Checkout Customer</button>
                        <button type="button" class="menuButt" onclick="validateUser('pastOrders','userText1')" > View Customer Orders</button>
                    </div>
                    <div class="empMan">
                        <input type="text" style="visibility:hidden" required> 
                        <button type="button" class="menuButt" onclick="showSelected('viewStock')"> View Stock</button>
                        <button type="button" class="menuButt" style='background-color:#ea6153' onclick="showSelected('empStatistics')"> Statistics</button>
                    </div>
                    <button type="button" id = "logOff" class = "menuButt" onclick="window.location='logoff.jsp'">
                        Log Off
                    </button>
                </div>
                <div id="manMenu" style="display:none">
                    <div class="custEmp">
                        <input type="text" id="userText2" placeholder="Enter Customer username." required> 
                        <button type="button" class="menuButt" onclick="validateUser('createOrder','userText2')"> Checkout Customer</button>
                        <button type="button" class="menuButt" onclick="validateUser('pastOrders','userText2')" > View Customer Orders</button>
                    </div>
                    <div class="empMan">
                        <input type="text" style="visibility:hidden" required> 
                        <button type="button" class="menuButt" onclick="showSelected('viewStock')"> View Stock</button>
                        <button type="button" class="menuButt" style='background-color:#ea6153' onclick="showSelected('manStatistics')"> Statistics</button>
                    </div>
                    <div class="man">
                        <input type="text" style="visibility:hidden" required> 
                        <button type="button" class="menuButt" onclick="clearCustSesh('createSuppOrder')">Create Supply Order</button>
                        <button type="button" class="menuButt" onclick="showSelected('supplyOrders')">View Supply Orders</button>
                    </div>
                    <div class = "man2">
                        <input type="text" style="visibility:hidden" required> 
                        <button type="button" class="menuButt" onclick="showSelected('modStockInfo')">Modify Stock Information</button>
                        <button type="button" class="menuButt" onclick="showSelected('manUsers')">Manage Users</button>
                    </div>
                    <button type="button" id = "logOff" class = "menuButt" onclick="window.location='logoff.jsp'">
                        Log Off
                    </button>
                </div>

                </div>

            <div id="categories" class="centerBox" style="display:none"></div>

            <div id="productList" class="centerBox" style="display:none"></div>

            <div id="productCart" class="rightBox" style="display:none"></div>

            <div id="pastOrders" class="centerBox" style="display:none; width:750px"></div>

            <div id ="orderDetails" class="rightBox" style="display:none"></div>

            <div id="stockList" class="centerBox" style="display:none"></div>

            <div id="supplyProdCart" class="rightBox" style="display:none"></div>

            <div id="itemList" class="centerBox" style="display:none"></div>

            <div id="userList" class="centerBox" style="display:none"></div>

            <div id="stats" class="centerBox" style="display:none"></div>

            <div id="manStatsMenu" class="centerBox" style="display:none"></div>

            <%
               // String uType = session.getAttribute("userType").toString();
               //if(uType.compareTo("C") == 0)
               out.println("<script>showMenuType('"+session.getAttribute("userType") +"');</script>");
               %>

                </body>
            </html>
