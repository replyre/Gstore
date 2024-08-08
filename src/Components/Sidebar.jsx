import AddIcon from "@mui/icons-material/Add";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import React, { useState } from "react";
import "./Sidebar.css";
import { Box, Divider, LinearProgress } from "@mui/material";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { db, storage } from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const FileInput = ({ file, setFile }) => {
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 20px",
      backgroundColor: "#f0f0f0",
      borderRadius: "5px",
      cursor: "pointer",
      border: "2px dashed #aaa",
      width: "250px",
      margin: "20px auto",
    },
    input: {
      display: "none",
    },
    label: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    svg: {
      marginRight: "10px",
      width: "24px",
      height: "24px",
      fill: "#555",
    },
    text: {
      fontSize: "16px",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        id="file"
        style={styles.input}
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <label htmlFor="file" style={styles.label}>
        <svg
          style={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M16.88 3.41A5.95 5.95 0 0 0 12 1a5.95 5.95 0 0 0-4.88 2.41C5.23 5.37 4 7.83 4 11v7H3a1 1 0 0 0-1 1v1h20v-1a1 1 0 0 0-1-1h-1v-7c0-3.17-1.23-5.63-3.12-7.59zM18 17H6v-6c0-2.83 1.39-4.73 3-5.87 1.61 1.14 3 3.04 3 5.87v6zm-6-1v-5c0-1.75 1-3.25 2.5-3.5-1.25 1-2.5 2.5-2.5 4.5v4H8v-5c0-1.75 1-3.25 2.5-3.5-1.25 1-2.5 2.5-2.5 4.5v4H6v-6c0-2.33 1.26-4.09 2.88-5.09 1.61 1 3.12 2.76 3.12 5.09v6z" />
        </svg>
        {/* {console.log(file)} */}
        <span style={styles.text}>Choose a file</span>
      </label>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [uploading, setUploading] = useState(false);
  const handleStorage = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!file) {
      console.error("No file selected for upload");
      setUploading(false);
      return;
    }

    const storageRef = ref(storage, `files/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const bytesTransferred = snapshot.metadata.size;
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "myfiles"), {
        timestamp: serverTimestamp(),
        filename: file.name,
        fileURL: url,
        size: bytesTransferred,
      });

      console.log("File uploaded successfully:", snapshot);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "200px",
        minWidth: "100px",
        borderRight: "2px solid gainsboro",
        height: "85vh",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <div
        className="sidebar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 15px",
          border: "2px solid grey",
          width: "fit-content",
          margin: "10px auto ",
          borderRadius: "10px",
          boxShadow: "2px 2px 2px 1px grey",
          gap: "5px",
          marginTop: "40px",
        }}
        onClick={onOpenModal}
      >
        <AddIcon /> new
      </div>
      <div className="options">
        <p>
          <AppSettingsAltIcon /> My Device
        </p>
        <p>
          <DevicesIcon /> Computers
        </p>
        <p>
          <PeopleAltIcon /> Shared with me
        </p>
        <p>
          <ScheduleIcon /> Recent
        </p>
        <p>
          <DeleteIcon /> Trash
        </p>
      </div>
      <div>
        <Divider />
        <p>
          <p style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
            <CloudQueueIcon /> Storage
          </p>

          <Box sx={{ width: "80%", m: "auto" }}>
            <LinearProgress variant="determinate" value={30} />
            <p style={{ fontSize: "12px" }}>108/303 free Storage</p>
          </Box>
        </p>
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <h4 style={{ borderBottom: "2px solid grey", textAlign: "center" }}>
          Select a file to upload
        </h4>
        <FileInput file={file} setFile={setFile} />
        {file && (
          <p style={{ display: "flex", alignItems: "center" }}>
            <InsertDriveFileIcon />
            {file.name}
          </p>
        )}
        {!uploading ? (
          <input type="submit" onClick={(e) => handleStorage(e)} />
        ) : (
          <div>uploading</div>
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
