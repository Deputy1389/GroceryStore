<!--
login.jsp Authors: Oscar Cedano/Sean Gallagher
Queries the DB when user logs in with credentials
and checks if those credentials match a record in 
the User Table. If so, it creates a session and
logs the user in.
-->
<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController" %>
    <%
       //get form credentials from POST request
       String uName = request.getParameter("userN");
       String pWord = request.getParameter("pWord");

       //instantiate database controller
       DatabaseController dbc = new DatabaseController();
       dbc.Open();//open Connection to DB
       String[] userInfo = dbc.returnFoundUser(uName, pWord);//query DB
       dbc.Close();//close Connection to DB
       if(userInfo != null){
       session.setAttribute("userID", userInfo[0]);
       session.setAttribute("fName", userInfo[1]);
       session.setAttribute("lName", userInfo[2]);
       session.setAttribute("userType", userInfo[3]);
       response.sendRedirect("main.jsp");
       }
       else{
       out.println("Invalid credentials.<br/>");
       out.println("<a href='index.html'>Try Again.");
       }
    %>