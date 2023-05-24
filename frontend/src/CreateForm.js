import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const [shortcut, setShortcut] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shortcut || !url) {
      return;
    }

    const formData = { shortcut, url };

    try {
      const response = await fetch("http://localhost:80/manage/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/list");
      } else {
        console.log("Failed to create go link:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h1>Create Go Link</h1>
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

export default CreateForm;
