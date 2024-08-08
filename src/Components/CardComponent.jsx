import zIndex from "@mui/material/styles/zIndex";
import React, { useState, useRef, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";

const CardComponent = ({ username, setUser }) => {
  const [cardVisible, setCardVisible] = useState(false);
  const cardRef = useRef(null);

  const handleClickOutside = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setCardVisible(false);
    }
  };
  console.log(username);
  useEffect(() => {
    if (cardVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardVisible]);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <div>
      <span
        style={{
          fontSize: "18px",
          height: "30px",
          width: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
        onClick={() => setCardVisible(!cardVisible)}
      >
        {username.displayName.charAt(0)}
      </span>
      {cardVisible && (
        <div ref={cardRef} style={cardStyle}>
          <p>
            <span style={{ fontWeight: "bold" }}>email: </span>
            {username.email}
          </p>
          <button
            style={{
              background: "black",
              margin: "auto",
            }}
            onClick={handleSignOut}
          >
            signout
          </button>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  position: "absolute",
  top: "40px",
  fontSize: "11px",
  display: "flex",
  flexDirection: "column",
  right: "0px",
  width: "fit-content",
  padding: "0px 10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  zIndex: "2",
  paddingBottom: "10px",
};

export default CardComponent;
