package dbController;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import java.sql.ResultSet;
import java.util.*;

/*
 * Servlet implementation class for Servlet: DatabaseController
 *
 */
public class DatabaseController {
	static final long serialVersionUID = 1L;
	/**
	 * A handle to the connection to the DBMS.
	 */
	protected Connection connection_;
	/**
	 * A handle to the statement.
	 */
	protected Statement statement_;
	/**
	 * The connect string to specify the location of DBMS
	 */
	protected String connect_string_ = null;
	/**
	 * The password that is used to connect to the DBMS.
	 */
	protected String password = null;
	/**
	 * The username that is used to connect to the DBMS.
	 */
	protected String username = null;

	public DatabaseController() {
		// your cs login name
		username = "system";
		// your Oracle password, NNNN is the last four digits of your CSID
		password = "1234";
		connect_string_ = "jdbc:oracle:thin:@localhost:1521:superDB";
	}

	/**
	 * Closes the DBMS connection that was opened by the open call.
	 */
	public void Close() {
		try {
			statement_.close();
			connection_.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		connection_ = null;
	}

	/**
	 * Commits all update operations made to the dbms. If auto-commit is on,
	 * which is by default, it is not necessary to call this method.
	 */
	public void Commit() {
		try {
			if (connection_ != null && !connection_.isClosed())
				connection_.commit();
		} catch (SQLException e) {
			System.err.println("Commit failed");
			e.printStackTrace();
		}
	}

	public void Open() {
		try {
			Class.forName("oracle.jdbc.OracleDriver");
			connection_ = DriverManager.getConnection(connect_string_, username, password);
			statement_ = connection_.createStatement();
			return;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			System.exit(1); // programmer/dbsm error
		} catch (Exception ex) {
			ex.printStackTrace();
			System.exit(2);
		}
	}

	/*
	 * returnFoundUser(String, String) Authors: OscarCedano/SeanGallagher --
	 * Checks if the inputted username/password pair matches any record in the
	 * Users relation when logging in and returns an array holding user info if
	 * found. Otherwise returns null. If password is null runs query to verify
	 * user exists and still returns its information.
	 * 
	 */

	public String[] returnFoundUser(String uName, String pWord) {
		String[] userInfo = null;// to hold user information
		String query = "";
		if (pWord == null) {
			query = "SELECT * FROM Users WHERE username='" + uName + "'";
		} else
			query = "SELECT * FROM Users WHERE username ='" + uName + "' AND password = '" + pWord + "'";
		try {
			ResultSet rs = statement_.executeQuery(query);
			if (rs.next()) {
				userInfo = new String[4];
				userInfo[0] = rs.getString("userID");
				userInfo[1] = rs.getString("fName");
				userInfo[2] = rs.getString("lName");
				userInfo[3] = rs.getString("userType");
			}
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
		return userInfo;
	}

	/*
	 * getProducts(String) Authors: Oscar Cedano/Sean Gallagher -- Runs a SELECT
	 * sql stmt to retrieve the list of products in the inputted category.
	 * Returns a vector containing the products.
	 * 
	 */
	public Vector<String[]> getProducts(String category) {
		String query = "SELECT * FROM Items WHERE category = '" + category + "'";
		try {
			ResultSet rs = statement_.executeQuery(query);
			Vector<String[]> products = new Vector<String[]>();
			while (rs.next()) {
				String[] temp_record = new String[7];
				temp_record[0] = String.valueOf(rs.getInt("itemID"));
				temp_record[1] = rs.getString("itemName");
				temp_record[2] = rs.getString("itemDescription");
				temp_record[3] = String.valueOf(rs.getInt("inStock"));
				temp_record[4] = String.valueOf(rs.getDouble("price"));
				temp_record[5] = String.valueOf(rs.getDouble("supplyPrice"));
				temp_record[6] = rs.getString("category");
				products.add(temp_record);
			}
			return products;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		return null;
	}

	/*
	 * createOrder(int, double, String) Authors: Oscar Cedano/Sean Gallagher --
	 * INSERTS a new order in the Orders relation and returns a newly created
	 * unique orderID. Sets pickupDate to a standard of 2 days after the order
	 * was made for online orders, null for instore checkouts and same date for
	 * supply orders. Also runs a query to increment stock quantity when order
	 * type is supply.
	 */
	public int createOrder(int userID, double total, String orderType) {
		String pickupDate = "";// to set appropriate date
		if (orderType.compareTo("C") == 0)
			pickupDate = "sysdate+2";
		else if (orderType.compareTo("S") == 0) {
			pickupDate = "sysdate";
		} else if (orderType.compareTo("N") == 0)
			pickupDate = "null";
		String maxOrderID = "(SELECT NVL(MAX(orderID),0) as orderID FROM ORDERS)";
		String query = "INSERT INTO Orders VALUES(" + maxOrderID + " + 1," + userID + ",sysdate," + pickupDate + ","
				+ total + "," + "'" + orderType + "')";

		int orderID = -1;// orderID to return

		try {
			statement_.executeQuery(query);
			ResultSet rs = statement_.executeQuery(maxOrderID);
			if (rs.next()) {
				orderID = rs.getInt("orderID");
			}
		} catch (SQLException ex) {
			ex.printStackTrace();
			return -1;
		}
		return orderID;
	}

	/*
	 * setOrderItem(int,int,int) Authors: Oscar Cedano/Sean Gallagher -- Creates
	 * a new set of orderItems and assigns the orderID of our newly created
	 * order to each item. Also checks to see if type of newly inserted order is
	 * supply and if it is, increments the item relation's inStock attribute,
	 * otherwise decrements it.
	 */
	public void setOrderItem(int itemID, int orderID, int qty, String orderType) {
		Boolean isSupply = orderType.compareTo("S") == 0;// check if orderType
															// is supply
		String query = "INSERT INTO ORDERITEMS VALUES(" + orderID + "," + itemID + "," + qty + ")";
		String incQuery = "UPDATE ITEMS SET inStock = inStock + " + qty + " WHERE itemID = '" + itemID + "'";
		String decQuery = "UPDATE ITEMS SET inStock = inStock - " + qty + " WHERE itemID = '" + itemID + "'";
		try {
			statement_.executeQuery(query);
			if (isSupply)
				statement_.executeQuery(incQuery);// increment instock qty
			else
				statement_.executeQuery(decQuery);
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}

	/*
	 * getOrders(int) Authors: Oscar Cedano/Sean Gallagher -- Runs a SELECT sql
	 * stmt to retrieve the list of orders associated to the inputted userID.
	 * Returns a vector containing the orders.
	 * 
	 */
	public Vector<String[]> getOrders(int userID) {
		String query = "SELECT * FROM ORDERS WHERE userID = '" + userID + "' ORDER BY orderDT ASC";
		try {
			ResultSet rs = statement_.executeQuery(query);
			Vector<String[]> orders = new Vector<String[]>();
			while (rs.next()) {
				String[] temp_record = new String[6];
				temp_record[0] = String.valueOf(rs.getInt("orderID"));
				temp_record[1] = String.valueOf(rs.getInt("userID"));
				temp_record[2] = rs.getString("orderDT");
				temp_record[3] = rs.getString("pickupD");
				temp_record[4] = String.valueOf(rs.getDouble("total"));
				temp_record[5] = rs.getString("type");
				orders.add(temp_record);
			}
			return orders;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		return null;
	}

	/*
	 * getOrderItems(int) Authors: Oscar Cedano/Sean Gallagher -- Runs a SELECT
	 * sql stmt to retrieve the list of items associated to the inputted
	 * orderID. Returns a vector containing the items. Checks if supply or
	 * customer order to select the right price when calculating total.
	 * 
	 */
	public Vector<String[]> getOrderItems(int orderID, String orderType) {
		String price = "";
		if (orderType.compareTo("S") == 0)
			price = "supplyPrice";
		else
			price = "price";
		String query = "SELECT itemName, quantity, (quantity * " + price + ") as total FROM ORDERITEMS o "
				+ "JOIN ITEMS i ON o.itemID = i.itemID WHERE orderID = '" + orderID + "'";
		try {
			ResultSet rs = statement_.executeQuery(query);
			Vector<String[]> orderItems = new Vector<String[]>();
			while (rs.next()) {
				String[] temp_record = new String[3];
				temp_record[0] = String.valueOf(rs.getString("itemName"));
				temp_record[1] = String.valueOf(rs.getInt("quantity"));
				temp_record[2] = String.valueOf(rs.getDouble("total"));
				orderItems.add(temp_record);
			}
			return orderItems;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		return null;
	}

	/*
	 * getSupplyOrders() Authors: Oscar Cedano/Sean Gallagher -- Runs a SELECT
	 * sql stmt to retrieve the list of all orders where orderType is supply.
	 * 
	 */
	public Vector<String[]> getSupplyOrders() {
		String query = "SELECT * FROM ORDERS WHERE type='S' ORDER BY orderDT ASC";
		try {
			ResultSet rs = statement_.executeQuery(query);
			Vector<String[]> orders = new Vector<String[]>();
			while (rs.next()) {
				String[] temp_record = new String[6];
				temp_record[0] = String.valueOf(rs.getInt("orderID"));
				temp_record[1] = String.valueOf(rs.getInt("userID"));
				temp_record[2] = rs.getString("orderDT");
				temp_record[3] = rs.getString("pickupD");
				temp_record[4] = String.valueOf(rs.getDouble("total"));
				temp_record[5] = rs.getString("type");
				orders.add(temp_record);
			}
			return orders;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		return null;
	}

	/*
	 * updateAttribute(String, String, String) Authors: Oscar Cedano/Sean
	 * Gallagher -- Updates the inputted itemID's inputted attribute with the
	 * inputted value by doing a SQL update stmt.
	 * 
	 */
	public void updateAttribute(String itemID, String attribute, String newVal) {
		String query = "UPDATE ITEMS SET " + attribute + "='" + newVal + "' WHERE itemID='" + itemID + "'";
		try {
			statement_.executeQuery(query);
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}

	/*
	 * getUsers(int) Authors: Oscar Cedano/Sean Gallagher -- Runs a SELECT sql
	 * stmt to retrieve the list of users except the currently logged in user.
	 * 
	 */
	public Vector<String[]> getUsers(int userID) {
		String query = "SELECT * FROM USERS WHERE userID <> '" + userID + "'";
		try {
			ResultSet rs = statement_.executeQuery(query);
			Vector<String[]> users = new Vector<String[]>();
			while (rs.next()) {
				String[] temp_record = new String[6];
				temp_record[0] = String.valueOf(rs.getInt("userID"));
				temp_record[1] = rs.getString("username");
				temp_record[2] = rs.getString("password");
				temp_record[3] = rs.getString("fName");
				temp_record[4] = rs.getString("lName");
				temp_record[5] = rs.getString("userType");
				users.add(temp_record);
			}
			return users;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		return null;
	}

	/*
	 * addUser(int, double, String) Authors: Oscar Cedano/Sean Gallagher --
	 * INSERTS a new user in the USERS Relation. Checks the largest userID and
	 * adds 1 to it to make it unique.
	 */
	public void addUser(String username, String password, String fName, String lName, String userType) {
		String maxUserID = "(SELECT NVL(MAX(userID),0) as userID FROM Users)";
		String query = "INSERT INTO Users VALUES(" + maxUserID + " + 1,'" + username + "','" + password + "','" + fName
				+ "','" + lName + "','" + userType.toUpperCase() + "')";
		try {
			statement_.executeQuery(query);
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}

	/*
	 * deleteUser(int) Authors: Oscar Cedano/Sean Gallagher -- DELETES the user
	 * record associated with the inputted userID from our DB.
	 */
	public void deleteUser(int userID) {
		String query = "DELETE FROM USERS WHERE userID='" + userID + "'";
		try {
			statement_.executeQuery(query);
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}
	
	/*
	 * addItem(String, String, String, String, String, String) Authors: Oscar Cedano/Sean Gallagher --
	 * INSERTS a new user in the ITEMS Relation. Checks the largest itemID and
	 * adds 1 to it to make it unique.
	 */
	public void addItem(String itemName, String itemDescription, String inStock, String price, String supplyPrice, String category) {
		String maxItemID = "(SELECT NVL(MAX(itemID),0) as itemID FROM Items)";
		String query = "INSERT INTO Items VALUES(" + maxItemID + " + 1,'" + itemName + "','" + itemDescription + "','" + inStock
				+ "','" + price + "','" + supplyPrice + "','" + category + "')";
		try {
			statement_.executeQuery(query);
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}

	/*
	 * deleteItem(int) Authors: Oscar Cedano/Sean Gallagher -- DELETES the item
	 * record associated with the inputted itemID from our DB.
	 */
	public void deleteItem(int itemID) {
		String query = "DELETE FROM ITEMS WHERE itemID='" + itemID + "'";
		try {
			statement_.executeQuery(query);
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}
	
	/*
	 * runQuery(string) Authors: Oscar Cedano/Sean Gallagher -- Runs the
	 * selected query option and returns the result. There are 5 available
	 * queries to select. See PDF documentation for more information on them.
	 */
	public Vector<String[]> runQuery(String option, String category) {
		// number of customer orders placed today
		String query1 = "select count(*) from orders where trunc(orderDT) = trunc(sysdate)";
		
		// top 5 spending customers in DB
		String query2 = "SELECT * FROM(SELECT fname as First, lname as Last, sum(total) as Total "
				+ "FROM users join ORDERS ON users.userid = orders.userid "
				+ "WHERE USERTYPE = 'C' group by fname, lname order by total desc) " + "WHERE ROWNUM <= 5";
		
		// Total qty sold of items in user inputted category. 
		String query3 = "(SELECT i.itemName, NVL(sum(oi.QUANTITY),0) AS \"QTYSOLD\" from ITEMS i "
				+ "JOIN ORDERITEMS oi ON i.itemID = oi.itemID "
				+ "JOIN ORDERS o ON oi.orderID = o.orderID "
				+ "WHERE o.type IN ('C','N') AND i.Category = '" + category + "'"
				+ "GROUP BY i.itemName "
				+ "UNION "
				+ "SELECT ITEMNAME, (0) AS \"QTYSOLD\" FROM ITEMS "
				+ "WHERE itemID NOT IN(SELECT itemID FROM ORDERITEMS oi JOIN ORDERS o "
				+ "ON oi.orderID=o.orderID WHERE o.type IN ('C','N')) "
				+ "AND Category='" + category + "') ORDER BY QTYSOLD DESC";
		
		// Average total of today's customer orders
		String query4 = "select CAST(AVG(total) AS DECIMAL(19,2)) AS AVG from orders "
				+ "WHERE type IN ('C','N') AND trunc(orderDT) = trunc(sysdate)";
		
		// Show the amount earnings profited today in total.
		String query5 = "SELECT sum(PROFIT) as PROFIT FROM("
				+ "select ITEMNAME, (price - supplyprice) * oi.quantity as Profit "
				+ "from items i JOIN ORDERITEMS oi "
				+ "ON i.itemID = oi.itemID "
				+ "JOIN ORDERS o on oi.orderID = o.orderID "
				+ "WHERE o.type IN ('C','N') "
				+ "AND trunc(o.orderDT) = trunc(sysdate))";
		
		try {
			ResultSet rs = null;
			if (option.compareTo("1") == 0)
				rs = statement_.executeQuery(query1);
			if (option.compareTo("2") == 0)
				rs = statement_.executeQuery(query2);
			if (option.compareTo("3") == 0)
				rs = statement_.executeQuery(query3);
			if (option.compareTo("4") == 0)
				rs = statement_.executeQuery(query4);
			if (option.compareTo("5") == 0)
				rs = statement_.executeQuery(query5);
			Vector<String[]> results = new Vector<String[]>();
			while (rs.next()) {
				if (option.compareTo("1") == 0) {
					String[] temp_record = new String[1];
					temp_record[0] = String.valueOf(rs.getInt("count(*)"));
					results.add(temp_record);
				}
				if (option.compareTo("2") == 0) {
					String[] temp_record = new String[3];
					temp_record[0] = rs.getString("First");
					temp_record[1] = rs.getString("Last");
					temp_record[2] = rs.getString("Total");
					results.add(temp_record);
				}
				if (option.compareTo("3") == 0) {
					String[] temp_record = new String[2];
					temp_record[0] = rs.getString("itemName");
					temp_record[1] = String.valueOf(rs.getInt("QTYSOLD"));
					results.add(temp_record);
				}
				if (option.compareTo("4") == 0) {
					String[] temp_record = new String[1];
					temp_record[0] = String.valueOf(rs.getDouble("AVG"));
					results.add(temp_record);
				}
				if (option.compareTo("5") == 0) {
					String[] temp_record = new String[1];
					temp_record[0] = String.valueOf(rs.getDouble("Profit"));
					results.add(temp_record);
				}
			}
			return results;
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		return null;
	}

}
