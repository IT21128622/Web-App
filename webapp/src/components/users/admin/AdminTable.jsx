import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, createUser } from "../../../api/services/authService";
import UserModel from "../UserModel";

export default function AdminTable() {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);

  useEffect(() => {
    try {
      if (token) {
        getAllUsers(token, "admin")
          .then((response) => {
            console.log("API Response:", response.data); // Log the API response
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
        setAdminData((prevData) => [...prevData, response.newAdmin]);;
      } else {
        console.error("Failed to add admin: No new admin in response");
        setAdminData((prevData) => [...prevData, response.newAdmin]);
        alert("Failed to add admin  an unexpected error occurred " + response || "An unexpected error occurred while adding the admin");
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

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Render loading message while data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

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
            {adminData?.length > 0 ? (
              adminData?.map((admin) => (
                <tr key={admin?.id}>
                  <td>{admin?.username}</td>
                  <td>{admin?.email}</td>
                  <td>
                    <button className="btn btn-primary btn-sm">Details</button>
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
        show={showModal}
        title="Add New Admin"
        handleClose={handleCloseModal}
        handleAddUser={handleAddAdmin}
      />
    </div>
  );
}
