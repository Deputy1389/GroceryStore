
<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
    
<%
   /* 
    * getProducts.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and returns a json containing a 
    * list of the inputted category products.
    *
    */
   
   response.setContentType("application/json");
   String category = request.getParameter("cat");
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   JSONArray jArray = new JSONArray();
   
   Vector<String[]> products = dbc.getProducts(category);
   for(int i= 0; i < products.size(); i++){
      jArray.put(i, products.get(i));
   }
                                     
   dbc.Close();//close Connection to DB
   response.getWriter().print(jArray);
%>