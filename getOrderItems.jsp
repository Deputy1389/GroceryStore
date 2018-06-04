<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
                
<%
   /* 
    * getOrderItems.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and retrieves the list of the
    * items pertaining to a particular orderID.
    *
    */
   
   response.setContentType("application/json");
   //get orderID from ajax call data
   int orderID = Integer.parseInt((String) request.getParameter("orderID"));
   String orderType = request.getParameter("orderType");
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   JSONArray jArray = new JSONArray();
   
   Vector<String[]> orderItems = dbc.getOrderItems(orderID, orderType);
   for(int i= 0; i < orderItems.size(); i++){
      jArray.put(i, orderItems.get(i));
   }
                                     
   dbc.Close();//close Connection to DB
   response.getWriter().print(jArray);
%>