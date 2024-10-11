/* eslint-disable react/prop-types */
import "../styles/layout.css";
import { useState } from "react";
import profile from "../assets/images/profile.jpg";
import { FaBell } from "react-icons/fa";
import { useSelector,useDispatch, } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationModal from "./notifications/notificationModal";
import {signOutAction} from "../redux/auth/authAction"


export default function Layout({ children, title }) {
  // Get the user and role from Redux store
  const username = useSelector((state) => state.auth.loggedUser.username);
  const role = useSelector((state) => state.auth.loggedUser.role);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Function to handle opening/closing of the notifications modal
  const handleShowNotifications = () => setShowNotifications(true);
  const handleCloseNotifications = () => setShowNotifications(false);
  const handleLogout = () => {
    dispatch(signOutAction((navigate))); 
  };

  return (
    <div className="layout-container">
      <div className="title-bar">
        <div className="title">
          <p>{title}</p>
        </div>
        <div className="actions">
          <div className="notification-icon">
            <FaBell className="bell-icon" onClick={handleShowNotifications} />
          </div>
          <div className="user-profile">
            <img src={profile} alt="User" className="user-photo" />
            <div className="user-info">
              <p className="user-name">{username || "User"}</p>
              <p className="user-designation">{role || "Role"}</p>
            </div>
          </div>
          <div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="line"></div>
      <div className="body">{children}</div>
      <NotificationModal
        show={showNotifications}
        handleClose={handleCloseNotifications}
      />
    </div>
  );
}
