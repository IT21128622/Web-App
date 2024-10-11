import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createVender, getAllUsers } from "../../../api/services/authService";
import UserModel from "../modal/userModel";
import VendorDetailModel from "../modal/vendorDetail";

export default function VenderList() {
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);

  useEffect(() => {
    try {
      if (token) {
        getAllUsers(token, "vendor")
          .then((response) => {
            console.log("API Response:", response.data); // Log the API response
            setVendorData(response); // Store the array of admin objects in state
            setLoading(false);
          })
          .catch((error) => {
            console.error(
              "Error fetching vendor profiles:",
              error.response || error
            ); // Log the error
            alert(
              "Error fetching vendor profiles: " +
                (error.response?.data?.message ||
                  "An error occurred while fetching vendor profiles")
            );
            setLoading(false);
          });
      } else {
        console.error("No token found. Please log in.");
        alert("No token found. Please log in.");
        setLoading(false);
      }
    } catch (error) {
      alert("Error fetching vendor profiles");
      console.error("Error fetching vendor profiles:", error);
      alert(
        "Error fetching vendor profiles: " +
          (error.response?.data?.message ||
            "An error occurred while fetching vendor profiles")
      );
      setLoading(false);
    }
  }, [token]);

  const handleShowDetailModal = () => setShowDetailModal(true);
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleAddVendor = async (newVendor) => {
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
    try {
      const response = await createVender(
        newVendor.username,
        newVendor.password,
        newVendor.email,
        token
      );

      if (response) {
        setVendorData((prevData) => [...prevData, response.newVendor]);
        alert("New Vendor added successfully");
        window.location.reload();
      } else {
        console.error("Failed to add vendor: No new vendor in response");
        alert(
          "An unexpected error occurred while adding the Vendor " + response ||
            "An unexpected error occurred while adding the Vendor"
        );
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      alert("An unexpected error occurred while adding the Vendor");
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  // Render loading message while data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Search filter
  const filteredVendors = vendorData.filter(
    (vendor) =>
      vendor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render the table with admin profiles
  return (
    <div className="container">
      <div style={{ paddingBottom: "20px" }}>
        <button
          onClick={handleShowModal}
          className="btn btn-primary btn-block mt-4"
          style={{
            padding: "10px 20px",
            width: "100px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </div>
      <div className="d-flex justify-content-center m-3 w-100">
        <div className="rounded w-75 p-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username or email"
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
            {filteredVendors?.length > 0 ? (
              filteredVendors?.map((vendor) => (
                <tr key={vendor?.id}>
                  <td>{vendor?.username}</td>
                  <td>{vendor?.email}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setId(vendor.id);
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
                <td colSpan="3">No vendor profiles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserModel
        show={showModal}
        title="Add New Vendor"
        handleClose={handleCloseModal}
        handleAddUser={handleAddVendor}
      />
      <VendorDetailModel
        show={showDetailModal}
        id={id}
        title="Vendor Details"
        handleClose={handleCloseDetailModal}
        userType="vendor"
      />
    </div>
  );
}
