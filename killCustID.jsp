<!--
killCustID.jsp Authors: Oscar Cedano/Sean Gallagher
Destroys customerID session variable to avoid conflict
when switching from customer functions to manager functions.
-->

<%
   session.setAttribute("custID",null);
   
%>