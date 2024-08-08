import { Avatar, Divider, IconButton, InputBase } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AppsIcon from "@mui/icons-material/Apps";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import Sidebar from "../Components/Sidebar";
import Content from "../Components/Content";
import CardComponent from "../Components/CardComponent";
const Dashboard = ({ user, setUser }) => {
  const [card, setCard] = useState(false);
  return (
    <div>
      <nav style={{ justifyContent: "space-between" }}>
        <div>
          <img src="logo.svg" alt="" height={"40px"} width={"40px"} />
          Gstore
        </div>
        <div
          style={{
            padding: "0px",
            borderRadius: "10px",
            alignContent: "center",
          }}
        >
          <InputBase
            sx={{ flex: 1, width: "60vw" }}
            placeholder="Search in Drive"
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton
            sx={{
              p: 0,
              "&:hover": { border: "none", background: "transparent" },
            }}
            aria-label="search"
          >
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <SearchIcon />
          </IconButton>
        </div>
        <div style={{ color: "black" }}>
          <AppsIcon />
          <SettingsIcon />
          <HelpIcon />
          <p
            style={{
              fontSize: "11px",
              background: "gainsboro",
              borderRadius: "50%",
              cursor: "pointer",
              background: `url(${user.photoURL})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              color: "white",
              padding: "0px !important",
            }}
          >
            <CardComponent username={user} setUser={setUser} />
          </p>
        </div>
      </nav>
      <div style={{ height: "85vh", display: "flex" }}>
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};

export default Dashboard;
