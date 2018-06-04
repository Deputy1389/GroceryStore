<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray" %>
    
<%
   /* 
    * 5queries.jsp Authors: Oscar Cedano/Sean Gallagher
    * Connects to the DB and runs one of 5 available
    * system queries. Selection is passed is through AJAX call.
    * Returns query result.
    */
   
   response.setContentType("application/json");
   String option = request.getParameter("option");
   String category = "";
   if(option.compareTo("3") == 0)
        category = request.getParameter("category");
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   JSONArray jArray = new JSONArray();
   
   Vector<String[]> qResults = dbc.runQuery(option, category);
   for(int i= 0; i < qResults.size(); i++){
      jArray.put(i, qResults.get(i));
   }
                                     
   dbc.Close();//close Connection to DB
   response.getWriter().print(jArray);
%>