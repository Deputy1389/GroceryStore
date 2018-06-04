<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
<%
   /* 
    * deleteItem.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and calls our dbcontroller
    * to DELETE the record in the ITEMS relation associated
    * with the inputted itemID.
    */

    
   int itemID = Integer.parseInt((String) request.getParameter("itemID"));
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB

   
   dbc.deleteItem(itemID);
   
    
   dbc.Close();//close db connection
%>