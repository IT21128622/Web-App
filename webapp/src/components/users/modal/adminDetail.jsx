/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getUserById } from "../../../api/services/authService";
import UserCreated from "../table/userCreated";

export default function UserDetailModel({ show, id, title, handleClose }) {
  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    adminsCreated: [],
    csrCreated: [],
    customerApproved: [],
    vendorCreated: [],
  });

  const [showAdminCreated, setShowAdminCreated] = useState(false);
  const [showCsrCreated, setShowCsrCreated] = useState(false);
  const [showVendorCreated, setShowVendorCreated] = useState(false);
  const token = useSelector((state) => state.auth.loggedUser.token);

  useEffect(() => {
    const handleGetUserById = async () => {
      try {
        if (!token) {
          alert("Unauthorized access");
          return;
        }
        console.log("User ID:", id);
        const response = await getUserById(id, token, "admin");
        if (response) {
          setUser(response);
          console.log("User details:", response);
        } else {
          alert("Failed to fetch user details");
          console.error("Failed to fetch user details", response);
        }
      } catch (error) {
        alert("Failed to fetch user details");
        console.error("Failed to fetch user details", error);
      }
    };

    handleGetUserById();
  }, [id]);

  const handleAdminClick = () => {
    setShowVendorCreated(false);
    setShowCsrCreated(false);
    setShowAdminCreated(!showAdminCreated);
  };

  const handleCsrClick = () => {
    setShowVendorCreated(false);
    setShowAdminCreated(false);
    setShowCsrCreated(!showCsrCreated);
  };

  const handleVendorClick = () => {
    setShowAdminCreated(false);
    setShowCsrCreated(false);
    setShowVendorCreated(!showVendorCreated);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <button
          type="button"
          className="btn-close bg-danger"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex p-2 bg-light rounded shadow justify-content-center align-items-center">
          <Form.Group className="m-3">
            <Form.Label className="m-2">User Name:</Form.Label>
            <Form.Text>{user.username}</Form.Text>
          </Form.Group>

          <Form.Group className="m-3">
            <Form.Label className="m-2">User Email:</Form.Label>
            <Form.Text>{user.email}</Form.Text>
          </Form.Group>
        </div>
        <div className="d-flex p-2  justify-content-center align-items-center">
          <button
            onClick={handleCsrClick}
            className="btn btn-primary btn-block "
            style={{
              padding: "10px 20px",
              width: "100px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            CSR Created
          </button>
          <button
            onClick={handleAdminClick}
            className="btn btn-primary btn-block m-2"
            style={{
              padding: "10px 20px",
              width: "100px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Admin Created
          </button>
          <button
            onClick={handleVendorClick}
            className="btn btn-primary btn-block "
            style={{
              padding: "10px 20px",
              width: "100px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Vendor Created
          </button>
        </div>
        {showAdminCreated && <UserCreated admins={user.adminsCreated} />}
        {showCsrCreated && <UserCreated admins={user.csrCreated} />}
        {showVendorCreated && <UserCreated admins={user.vendorCreated} />}
      </Modal.Body>
    </Modal>
  );
}
