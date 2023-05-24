const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { URL } = require("url");

const app = express();
const port = 80;

// JSON file path
const filePath = "./links.json";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Load the links from the JSON file
let links = [];
fs.readFile(filePath, "utf8", (err, data) => {
  if (!err) {
    links = JSON.parse(data);
    console.log("Links loaded successfully.");
  }
});

// Handle the go links
app.get("/:shortcut", (req, res) => {
  const { shortcut } = req.params;
  const link = getLinkFromShortcut(shortcut);
  if (link) {
    res.redirect(link);
  } else {
    res.status(404).send("Shortcut not found.");
  }
});

// Handle the form submission to create new go links
app.post("/create", (req, res) => {
  const { shortcut, url } = req.body;
  const isValidUrl = validateUrl(url);

  if (!isValidUrl) {
    res.status(400).send("Invalid URL - " + url);
    return;
  }

  const link = {
    shortcut,
    url,
  };

  links.push(link);
  saveLinksToFile();

  res.send("Go link created successfully.");
});

// Helper function to validate URLs
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to retrieve a link from the JSON file
function getLinkFromShortcut(shortcut) {
  const link = links.find((item) => item.shortcut === shortcut);
  return link ? link.url : null;
}

// Helper function to save the links to the JSON file
function saveLinksToFile() {
  fs.writeFile(filePath, JSON.stringify(links, null, 2), (err) => {
    if (err) {
      console.error("Failed to save links to file.");
    } else {
      console.log("Links saved to file successfully.");
    }
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
