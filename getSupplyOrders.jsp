<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
                
<%
   /* 
    * getSupplyOrders.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and retrieves the list of the
    * supply orders by any manager.
    *
    */
   
   response.setContentType("application/json");
   
      
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   JSONArray jArray = new JSONArray();
   
   Vector<String[]> orders = dbc.getSupplyOrders();
   for(int i= 0; i < orders.size(); i++){
      jArray.put(i, orders.get(i));
   }
                                     
   dbc.Close();//close Connection to DB
   response.getWriter().print(jArray);
%>