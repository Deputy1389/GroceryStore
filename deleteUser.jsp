<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
<%
   /* 
    * deleteUser.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and calls our dbcontroller
    * to DELETE the record in the USERS relation associated
    * with the inputted userID.
    */

  
   int userID = Integer.parseInt((String) request.getParameter("userID"));
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB

   
   dbc.deleteUser(userID);
   
    
   dbc.Close();//close db connection
%>