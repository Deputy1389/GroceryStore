<!--
logoff.jsp Authors: Oscar Cedano/Sean Gallagher
Destroys session and logs the user off. Finally
returns to login screen.
-->

<%
   session.setAttribute("userID",null);
   session.setAttribute("fName", null);
   session.setAttribute("lName", null);
   session.setAttribute("userType", null);
   session.setAttribute("custID", null);
   session.invalidate();
   response.sendRedirect("index.html");
%>