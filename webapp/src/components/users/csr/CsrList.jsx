import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createCsr, getAllUsers } from "../../../api/services/authService";
import UserModel from "../modal/userModel";
import CsrDetailModel from "../modal/csrDetail";

export default function CsrList() {
  const [csrData, setCsrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);

  const handleShowDetailModal = () => setShowDetailModal(true);

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  useEffect(() => {
    try {
      if (token) {
        getAllUsers(token, "csr")
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
            alert(
              "Error fetching csr profiles: " +
                (error.response?.data?.message ||
                  "An error occurred while fetching csr profiles")
            );
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
      alert(
        "Error fetching csr profiles: " +
          (error.response?.data?.message ||
            "An error occurred while fetching csr profiles")
      );
      setLoading(false);
    }
  }, [token]);

  const handleAddCsr = async (newCsr) => {
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
    try {
      const response = await createCsr(
        newCsr.username,
        newCsr.password,
        newCsr.email,
        token
      );

      if (response.newCsr) {
        alert("New CSR added successfully");
        setCsrData((prevData) => [...prevData, response.newCsr]);
      } else {
        alert("An unexpected error occurred while adding the CSR");
        console.error(
          "Error adding CSR: " + response ||
            "An unexpected error occurred while adding the CSR"
        );
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("An unexpected error occurred while adding the CSR");
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Search filter
  const filteredCsr = csrData.filter(
    (csr) =>
      csr.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      csr.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render loading message while data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render the table with admin profiles
  return (
    <div className="container">
      <div className="header-container d-flex justify-content-between align-items-center">
        <div>
          <button
            onClick={handleShowModal}
            className="btn btn-primary btn-block"
            style={{ padding: "5px 10px", width: "100px", fontSize: "16px", fontWeight: "bold" }}
          >
            Add
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table custom-table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCsr?.length > 0 ? (
              csrData.map((csr) => (
                <tr key={csr?.id}>
                  <td>{csr?.username}</td>
                  <td>{csr?.email}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setId(csr.id);
                        handleShowDetailModal();
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No CSR profiles found</td>
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
      <CsrDetailModel
        show={showDetailModal}
        id={id}
        title="CSR Details"
        handleClose={handleCloseDetailModal}
        userType="csr"
      />
    </div>
  );
}
