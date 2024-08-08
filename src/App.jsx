import "./App.css";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import React, { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  console.log(user);
  return (
    <div className="App">
      {user === null ? (
        <Home user={user} setUser={setUser} />
      ) : (
        <Dashboard user={user} setUser={setUser} />
      )}
      {/* */}
    </div>
  );
}

export default App;
