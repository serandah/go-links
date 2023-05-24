import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

const Form = () => {
  const [shortcut, setShortcut] = useState("");
  const [url, setUrl] = useState("");

  const { shortcut: paramShortcut } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the go link by shortcut if the parameter is present
    if (paramShortcut) {
      fetchGoLink(paramShortcut);
    }
  }, [paramShortcut]);

  const fetchGoLink = async (shortcut) => {
    try {
      const response = await fetch(
        `http://localhost:80/manage/get/${shortcut}`
      );
      if (response.ok) {
        const data = await response.json();
        setShortcut(data.shortcut);
        setUrl(data.url);
      } else {
        console.log("Failed to fetch go link:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shortcut || !url) {
      return;
    }

    const formData = { shortcut, url };

    try {
      const response = await fetch(
        "http://localhost:80/manage/update/" + shortcut,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/list");
      } else {
        console.log("Failed to update go link:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h1>
        Edit <em>{shortcut}</em>
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Shortcut:
          <input
            type="text"
            value={shortcut}
            onChange={(e) => setShortcut(e.target.value)}
          />
        </label>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
