import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Form from "./Form";
import List from "./List";
import CreateForm from "./CreateForm";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul
            style={{
              display: "flex",
              width: "180px",
              justifyContent: "space-between",
            }}
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/list">Manage</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/update/:shortcut" element={<Form />} />
          <Route path="/create" element={<CreateForm />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Fetch all go links
    fetchGoLinks();
  }, []);

  const fetchGoLinks = async () => {
    try {
      const response = await fetch("http://localhost:80/manage/list");
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      } else {
        console.log("Failed to fetch go links:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h2>Current Links</h2>
      <ul>
        {links.map((link) => (
          <li key={link.shortcut}>
            <Link to={`http://go/${link.shortcut}`} target="_blank">
              {link.shortcut}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
