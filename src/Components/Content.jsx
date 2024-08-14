import {
  ArrowDownward,
  ArrowDropDown,
  FormatListBulleted,
  Info,
  Link,
} from "@mui/icons-material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { storage } from "../config/firebaseConfig";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import Delete from "@mui/icons-material/Delete";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

let rows = [];
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const Content = () => {
  const [files, setFiles] = useState([]);
  const db = getFirestore();
  useEffect(() => {
    onSnapshot(collection(db, "myfiles"), (snapshot) => {
      setFiles(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, [db]);

  const handleDelete = async (fileURL, docId) => {
    try {
      // Reference to the file in Firebase Storage
      const storageRef = ref(storage, fileURL);

      // Delete the file from Firebase Storage
      await deleteObject(storageRef);
      console.log("File deleted successfully from storage");

      // Reference to the document in Firestore
      const docRef = doc(db, "myfiles", docId);

      // Delete the document from Firestore
      await deleteDoc(docRef);
      toast.error("Document Deleted", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error deleting file or document:", error);
      toast.error("Error deleting doc.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  {
    files &&
      (rows = files.map((e) => {
        return {
          name: e.data.filename,
          calories: "me",
          fat: e.data?.timestamp?.seconds || " ",
          carbs: e.data.size,
          id: e.id,
          fileURL: e.data.fileURL,
        };
      }));
  }
  function BasicTable() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                Name <ArrowDownward />{" "}
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">Owner</TableCell>
              <TableCell align="right">Last Modified &nbsp;</TableCell>
              <TableCell align="right">File Size </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleDelete(row.fileURL, row.id);
                    }}
                  >
                    {" "}
                    <Delete />
                  </span>
                  <CopyToClipboard text={`${row.fileURL}`}>
                    <abbr
                      title="copy link to share"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        toast.success("Link Copied !", {
                          position: "top-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      }}
                    >
                      <Link />
                    </abbr>
                  </CopyToClipboard>
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">
                  {new Date(row.fat * 1000).toUTCString()}
                </TableCell>
                <TableCell align="right">{formatBytes(row.carbs)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  console.log(rows);

  return (
    <div style={{ overflowX: "hidden" }}>
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "85vw",
          borderBottom: "2px solid grey",
          marginLeft: "20px",
        }}
        className="short"
      >
        <p style={{ display: "flex", alignItems: "center" }}>
          My drive <ArrowDropDown />
        </p>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FormatListBulleted />
          <Info />
        </p>
      </section>
      <section
        style={{
          padding: "30px",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {files &&
          files.map((e) => {
            return (
              <a
                href={`${e.data.fileURL}`}
                target="_blank"
                key={e?.id}
                style={{
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid gainsboro",
                  width: "fit-content",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "10px",
                  transform: "scale(1.2)",
                }}
              >
                <InsertDriveFileIcon style={{ padding: " 10px 10px" }} />
                <p
                  style={{
                    background: "gainsboro",
                    padding: " 5px 10px",
                    margin: "0px",
                    fontSize: "11px",
                  }}
                >
                  {e.data.filename}
                </p>
              </a>
            );
          })}
      </section>
      <section style={{ paddingLeft: "10px" }}>
        {files && <BasicTable />}
      </section>
    </div>
  );
};

export default Content;
