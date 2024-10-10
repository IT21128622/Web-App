import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createCsr, getAllUsers } from "../../../api/services/authService";
import UserModel from "../UserModel";

export default function CsrList() {
  const [csrData, setCsrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);

  useEffect(() => {
    try {
      if (token) {
        getAllUsers(token , "csr")
          .then((response) => {
            console.log("API Response:", response.data); // Log the API response
            setCsrData(response); // Store the array of csr objects in state
            setLoading(false); 
            //console.log("csr Data:", csrData);
          })
          .catch((error) => {
            console.error(
              "Error fetching csr profiles:",
              error.response || error
            ); // Log the error
            alert("Error fetching csr profiles: " + (error.response?.data?.message || "An error occurred while fetching csr profiles"));
            setLoading(false);
          });
      } else {
        console.error("No token found. Please log in.");
        alert("No token found. Please log in.");
        setLoading(false);
      }
    } catch (error) {
      alert("Error fetching csr profiles");
      console.error("Error fetching csr profiles:", error);
      alert("Error fetching csr profiles: " + (error.response?.data?.message || "An error occurred while fetching csr profiles"));
      setLoading(false);
    }
  }, [token]);

  const handleAddCsr = async (newCsr) => {
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
    try {
      const response = await createCsr(newCsr.username, newCsr.password, newCsr.email, token);

      if (response.newCsr) {
        alert("New CSR added successfully");
        setCsrData((prevData) => [...prevData, response.newCsr]);
      } else {
        alert("An unexpected error occurred while adding the CSR");
        console.error("Error adding CSR: "  + response || "An unexpected error occurred while adding the CSR");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("An unexpected error occurred while adding the CSR");
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Render loading message while data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render the table with admin profiles
  return (
    
    <div className="container">
        <div style={{paddingBottom: "20px"}}>
        <button
               onClick={handleShowModal}
              className="btn btn-primary btn-block mt-4"
              style={{padding: "10px 20px", width: "100px", fontSize: "16px", fontWeight: "bold"}}>
             Add
            </button>
        </div>
      
      <div className="table-wrapper" >
        <table className="table custom-table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {csrData?.length > 0 ? (
              csrData.map((csr) => (
                <tr key={csr?.id}>
                  <td>{csr?.username}</td>
                  <td>{csr?.email}</td>
                  <td><button  className="btn btn-primary btn-sm">Details</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No admin profiles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserModel
        show={showModal}
        title="Add New CSR"
        handleClose={handleCloseModal}
        handleAddUser={handleAddCsr}
      />
    </div>
  );
}
