import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const List = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
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

  const deleteLink = async (shortcut) => {
    try {
      const response = await fetch(
        `http://localhost:80/manage/delete/${shortcut}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchGoLinks();
      } else {
        console.log("Failed to delete go link:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h1>Manage links</h1>
      <ul>
        {links.map((link) => (
          <li key={link.shortcut}>
            {link.shortcut} - <Link to={`/update/${link.shortcut}`}>Edit</Link>
            {" / "}
            <button onClick={() => deleteLink(link.shortcut)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
