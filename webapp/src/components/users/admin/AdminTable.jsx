import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, createUser } from "../../../api/services/authService";
import UserModel from "../modal/userModel";
import UserDetailModel from "../modal/adminDetail";

export default function AdminTable() {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [id, setId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);
  const handleCloseModal = () => setShowAddModal(false);
  const handleShowModal = () => setShowAddModal(true);
  const handleShowDetailModal = () => setShowDetailModal(true);
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  useEffect(() => {
    try {
      if (token) {
        getAllUsers(token, "admin")
          .then((response) => {
            console.log("API Response:", response); // Log the API response
            setAdminData(response); // Store the array of admin objects in state
            setLoading(false);
            console.log("Admin Data:", adminData);
          })
          .catch((error) => {
            console.error(
              "Error fetching admin profiles:",
              error.response || error
            ); // Log the error
            alert(
              "Error fetching admin profiles: " +
                (error.response?.data?.message ||
                  "An error occurred while fetching admin profiles")
            );
            setLoading(false);
          });
      } else {
        console.error("No token found. Please log in.");
        alert("No token found. Please log in.");
        setLoading(false);
      }
    } catch (error) {
      alert("Error fetching admin profiles");
      console.error("Error fetching admin profiles:", error);
      alert(
        "Error fetching admin profiles: " +
          (error.response?.data?.message ||
            "An error occurred while fetching admin profiles")
      );
      setLoading(false);
    }
  }, [token]);

  const handleAddAdmin = async (newAdmin) => {
    try {
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await createUser(
        newAdmin.username,
        newAdmin.password,
        newAdmin.email,
        token,
        "admin"
      );

      if (response) {
        alert("Admin added successfully");
        window.location.reload();
        setAdminData((prevData) => [...prevData, response.newAdmin]);
      } else {
        console.error("Failed to add admin: No new admin in response");
        setAdminData((prevData) => [...prevData, response.newAdmin]);
        alert(
          "Failed to add admin  an unexpected error occurred " + response ||
            "An unexpected error occurred while adding the admin"
        );
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert(
        "Error adding admin: " +
          (error.response?.data?.message ||
            "An error occurred while adding the admin")
      );
    }
  };

  // Search filter
  const filteredAdmins = adminData.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredAdmins?.length > 0 ? (
              filteredAdmins?.map((admin) => (
                <tr key={admin?.id}>
                  <td>{admin?.username}</td>
                  <td>{admin?.email}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setId(admin.id);
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
                <td colSpan="3">No admin profiles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserModel
        show={showAddModal}
        title="Add New Admin"
        handleClose={handleCloseModal}
        handleAddUser={handleAddAdmin}
      />
      <UserDetailModel
        show={showDetailModal}
        id={id}
        title="Admin Details"
        handleClose={handleCloseDetailModal}
      />
    </div>
  );
}
