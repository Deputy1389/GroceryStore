<!-- setCustID.jsp Authors: Oscar Cedano/Sean Gallagher --
Sets the custID session variable to the variable of the user
a manager or employee is trying to do operations with. Will
only be fired when employee/manager is logged in and a customer
option has been selected
-->
<%@page import="java.util.*,java.lang.StringBuffer,
                dbController.DatabaseController" %>
    <%
       //get custID from ajax call params
       String custID = request.getParameter("custID");
       session.setAttribute("custID", custID);
    %>