<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
                
<%
   /* 
    * getUsers.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and retrieves the list of the
    * system users.
    *
    */
   
   response.setContentType("application/json");
   
   //check customer vs employee/manager
   String userID = (String) session.getAttribute("userID");
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   JSONArray jArray = new JSONArray();
   
   Vector<String[]> users = dbc.getUsers(Integer.parseInt(userID));
   for(int i= 0; i < users.size(); i++){
      jArray.put(i, users.get(i));
   }
                                     
   dbc.Close();//close Connection to DB
   response.getWriter().print(jArray);
%>