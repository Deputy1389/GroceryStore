<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
<%
   /* 
    * submitOrder.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and calls our dbcontroller
    * to INSERT a new record in the ORDERITEMS relation when
    * a new order is submitted.
    *
    */

   //array holding all of our order products
   JSONArray cartArray = new JSONArray(request.getParameter("cartArray"));
   double total = Double.valueOf(request.getParameter("orderTotal"));
   String orderType = request.getParameter("orderType"); 
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   
   //create a new order and get order number
   //check customer vs employee/manager
   String userID = "";
   if(session.getAttribute("custID") != null){//is employee/manager
        userID = (String) session.getAttribute("custID");
        orderType = "N";//In-Store Checkout
   }
   else
        userID = (String) session.getAttribute("userID");
   
   int orderID = dbc.createOrder(Integer.parseInt(userID), total, orderType);
   
   //assign orderID to each item in cart
   for(int i = 0; i<cartArray.length(); i++){
       dbc.setOrderItem(cartArray.getJSONObject(i).getInt("itemID"), orderID, cartArray.getJSONObject(i).getInt("qty"), orderType);
    }
    
   dbc.Close();//close db connection
   out.println(orderID);//if -1 interface will throw error message
%>