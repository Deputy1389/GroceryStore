<%@page import="java.util.*,java.lang.StringBuffer,dbController.DatabaseController, org.json.JSONObject, org.json.JSONArray"%><%
   /* checkUserExists.jsp Authors: Oscar Cedano/Sean Gallagher --
    * Makes a call to our database controller in order to verify
    * that inputted username is in our table. If it is, returns
    * user info, null otherwise.
    */
   
   response.setContentType("application/json");
   //get username from AJAX post
   String username = request.getParameter("username");
   //instantiate database controller
   DatabaseController dbc = new DatabaseController();
   dbc.Open();//open Connection to DB
   String[] userInfo = dbc.returnFoundUser(username, null);//query DB
   dbc.Close();//close Connection to DB
   if(userInfo != null){
        JSONArray jArray = new JSONArray();
        for(int i= 0; i < userInfo.length; i++){
           jArray.put(i, userInfo[i]);
         }
         response.getWriter().print(jArray);
   }else
     out.print("-1");
 
%>