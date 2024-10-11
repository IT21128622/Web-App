/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getUserById } from "../../../api/services/authService";

export default function CsrDetailModel({ show, id, title, handleClose }) {
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

  const token = useSelector((state) => state.auth.loggedUser.token);

  useEffect(() => {
    const handleGetUserById = async () => {
      try {
        if (!token) {
          alert("Unauthorized access");
          return;
        }
        console.log("User ID:", id);
        const response = await getUserById(id, token, "csr");
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
      </Modal.Body>
    </Modal>
  );
}
