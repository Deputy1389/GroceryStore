<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
<%
   /* 
    * submitChange.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and UPDATES the inputted items selected
    * attribute with the inputted information.
    */

   //array holding all of our order products
   String itemID = request.getParameter("itemID");
   String attribute = request.getParameter("attr");
   String newVal = request.getParameter("newVal"); 
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   
   //call update function
   dbc.updateAttribute(itemID, attribute, newVal);
   
    
   dbc.Close();//close db connection
%>