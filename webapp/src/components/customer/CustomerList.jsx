/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  getAllUsers,
  getApprovedCus,
  getUnapprovedCus,
  getUserById,
} from "../../api/services/authService";
import { useSelector } from "react-redux";
import { ButtonGroup, Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faThumbsUp,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { approveCustomer, deactivateCustomer, reactivateCustomer } from "../../api/services/customerService";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [usernames, setUsernames] = useState({});

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);
  //Get the email from the Redux store
  const email = useSelector((state) => state.auth.loggedUser.email);

  const fetchCustomers = async (type) => {
    setLoading(true);
    setError(null);
    let fetchApi;

    // Choose the appropriate API based on the button clicked
    if (type === "all") {
      fetchApi = () => getAllUsers(token, "customer");
    } else if (type === "approved") {
      fetchApi = () => getApprovedCus(token);
    } else if (type === "unapproved") {
      fetchApi = () => getUnapprovedCus(token);
    }

    // Fetch data from the selected API
    try {
      const response = await fetchApi();
      setCustomers(response);
      setLoading(false);
      console.log("Customers: ", customers)
      const newUsernames = {};
      for (const customer of response) {
        if (customer.approvedBy) {
          const userResponse = await getUserById(customer.approvedBy, "admin", token);
          newUsernames[customer.approvedBy] = userResponse.username;
          if(userResponse == "A user with the provided ID does not exist."){
            const userCsrResponse = await getUserById(customer.approvedBy, "admin", token);
            newUsernames[customer.approvedBy] = userCsrResponse.username;
          }
        }
      }
      setUsernames(newUsernames);
    } catch (error) {
      setError("Failed to fetch customer data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCustomers("all");
    }
  }, [token]);

  const handleTabChange = (type) => {
    setActiveTab(type);
    fetchCustomers(type);
  };

  const renderApprovalStatus = (status) => {
    return status === true ? (
      <Badge bg="success">Approved</Badge>
    ) : (
      <Badge bg="secondary">Pending</Badge>
    );
  };

  const renderActiveStatus = (status) => {
    return status === false ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="danger">Deactive</Badge>
    );
  };

  //Approve customer
  const customerApproval = async (userId) => {
    try {
      if (!token) {
        alert("Unauthorized!");
      }
      const response = await approveCustomer(token, email, userId);
      if (response) {
       alert("The user was approved successfully");
       window.location.reload();
      }
    } catch (error) {
      console.error("Error " + error);
      alert("Sorry an unexpected error occured!");
    }
  };

  //ReActivate Customer 
  const customerActivation = async (userId) => {
    try {
      if(!token) {
        alert("Unauthorized!");
      }
      const response = await reactivateCustomer(token, email, userId, "admin");
      if(response){
        alert("Customer successfully reactivated");
        window.location.reload();
      } else {
        alert("Customer reactivation failed")
      }
    }catch(error){
        console.log("Error " + error);
        alert("Sorry an error occured!")
    }
  }

  //Deactivate Customer
  const customerDeActivation = async (userId) => {
    try {
      if(!token) {
        alert("Unauthorized!");
      }
      const response = await deactivateCustomer(token, email, userId, "admin");
      if(response){
        alert("Customer successfully deactivated");
        window.location.reload();
      } else {
        alert("Customer reactivation failed")
      }
    }catch(error){
        console.log("Error " + error);
        alert("Sorry an error occured!")
    }
  }


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <ButtonGroup className="mb-3 d-flex justify-content-between">
        <Button
          variant="primary"
          className="mx-2 flex-fill rounded"
          onClick={() => handleTabChange("all")}
          active={activeTab === "all"}
        >
          All Customers
        </Button>
        <Button
          variant="primary"
          className="mx-2 flex-fill rounded"
          onClick={() => handleTabChange("approved")}
          active={activeTab === "approved"}
        >
          Approved
        </Button>
        <Button
          variant="primary"
          className="mx-2 flex-fill rounded"
          onClick={() => handleTabChange("unapproved")}
          active={activeTab === "unapproved"}
        >
          Unapproved
        </Button>
      </ButtonGroup>

      <div className="table-responsive">
      <table className="table  w-100">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Approval Status</th>
              <th scope="col">Approved By</th>
              <th scope="col">Activated Status</th>
              <th scope="col">Deactivated By</th>
              <th scope="col">Reactivated By</th>
              <th scope="col">Deactivate</th>
              <th scope="col">Reactivate</th>
              <th scope="col">Approve</th>
            </tr>
          </thead>
          <tbody>
            {customers?.length > 0 ? (
              customers?.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{renderApprovalStatus(customer.approvalStatus)}</td>
                  <td>{usernames[customer.approvedBy] || "N/A"}</td>
                  <td>{renderActiveStatus(customer.deactivated)}</td>
                  <td>{usernames[customer.deactivatedBy] || "N/A"}</td>
                  <td>{usernames[customer.reactivatedBy] || "N/A"}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="close border-0 bg-transparent m-2"
                      aria-label="Close"
                      onClick={() => customerDeActivation(customer?.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: "red" }}
                      />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="close border-0 bg-transparent m-2"
                      aria-label="Close"
                      onClick={() => customerActivation(customer?.id)}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        style={{ color: "green" }}
                      />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="close border-0 bg-transparent m-2"
                      aria-label="Close"
                      onClick={() => customerApproval(customer?.id)}
                    >
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        style={{ color: "blue" }}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
