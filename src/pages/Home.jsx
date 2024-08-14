// SignInPopup.js
import React from "react";
import { auth, googleProvider } from "../config/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const SignInPopup = ({ setUser }) => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The signed-in user info.
      const user = result.user;
      setUser(user);
      console.log("User signed in: ", user);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Login</button>
    </div>
  );
};

const Home = ({ user, setUser }) => {
  return (
    <>
      <nav>
        <div>
          <img src="logo.svg" alt="" height={"40px"} width={"40px"} />
          Gstore
        </div>
        <div>
          <SignInPopup setUser={setUser} />
        </div>
      </nav>
      <div className="login-content">
        <div>
          {" "}
          <h1
            style={{
              display: "flex",
              alignContent: "center",
              gap: "10px",
              fontWeight: "400",
              fontSize: "3vw",
              width: "80%",
            }}
          >
            Easy and secure access to your content
          </h1>
          <p>
            A google drive clone where you can store images, videos, doc files
            and many more.{" "}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                window.open("https://www.google.com/drive/", "_blank");
              }}
            >
              G-Drive Link
            </button>
            <SignInPopup setUser={setUser} />
          </div>
        </div>
        <img src="./drivewebp.webp" alt="" />
      </div>
    </>
  );
};

export default Home;
