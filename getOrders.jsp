<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
                
<%
   /* 
    * getOrders.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and retrieves the list of the
    * inputted users userID orders
    *
    */
   
   response.setContentType("application/json");
   
   //check customer vs employee/manager
   String userID = "";
   if(session.getAttribute("custID") != null)//is employee/manager
        userID = (String) session.getAttribute("custID");
   else
        userID = (String)session.getAttribute("userID");
   
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   JSONArray jArray = new JSONArray();
   
   Vector<String[]> orders = dbc.getOrders(Integer.parseInt(userID));
   for(int i= 0; i < orders.size(); i++){
      jArray.put(i, orders.get(i));
   }
                                     
   dbc.Close();//close Connection to DB
   response.getWriter().print(jArray);
%>