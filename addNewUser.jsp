<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
<%
   /* 
    * addNewUser.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and calls our dbcontroller
    * to INSERT a new record in the USERS relation when
    * a new user is added.
    *
    */

   //array holding all of our order products
   String username = request.getParameter("username");
   String password = request.getParameter("password");
   String fName = request.getParameter("fName");
   String lName = request.getParameter("lName");
   String userType = request.getParameter("userType"); 
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB

   
   dbc.addUser(username,password,fName,lName,userType);
   
    
   dbc.Close();//close db connection
%>