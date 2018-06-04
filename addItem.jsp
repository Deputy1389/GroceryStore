<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
<%
   /* 
    * addNewItem.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and calls our dbcontroller
    * to INSERT a new record in the ITEMS relation when
    * a new user is added.
    *
    */

   //array holding all of our order products
   String itemName = request.getParameter("itemName");
   String itemDescription = request.getParameter("itemDesc");
   String inStock = (String)request.getParameter("inStock");
   String price = (String)request.getParameter("price");
   String supplyPrice = (String)request.getParameter("supplyPrice");
   String category = request.getParameter("category"); 
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB

   
   dbc.addItem(itemName,itemDescription,inStock,price,supplyPrice,category);
   
    
   dbc.Close();//close db connection
%>