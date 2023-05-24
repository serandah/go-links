const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { URL } = require("url");
const { log } = require("console");

const app = express();
const port = 80;

// JSON file path
const filePath = "./links.json";

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser middleware

// Load the links from the JSON file
let links = [];
fs.readFile(filePath, "utf8", (err, data) => {
  if (!err) {
    links = JSON.parse(data);
    console.log("Links loaded successfully.");
  }
});

// Return all the current go links
app.get("/manage/list", (req, res) => {
  res.json(links);
});

// Handle the form submission to create new go links
app.post("/manage/create", (req, res) => {
  const { shortcut, url } = req.body;
  const isValidUrl = validateUrl(url);

  if (!isValidUrl) {
    res.status(400).send("Invalid URL.");
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

// Handle the form submission to update go links
app.put("/manage/update/:shortcut", (req, res) => {
  const { shortcut } = req.params;
  const { url } = req.body;
  const isValidUrl = validateUrl(url);

  if (!isValidUrl) {
    res.status(400).send("Invalid URL.");
    return;
  }

  const link = getLinkFromShortcut(shortcut);
  if (link) {
    link.url = url;
    console.log(links);
    saveLinksToFile();
    res.send("Go link updated successfully.");
  } else {
    res.status(404).send("Shortcut not found.");
  }
});

// Handle the form submission to delete go links
app.delete("/manage/delete/:shortcut", (req, res) => {
  const { shortcut } = req.params;
  const linkIndex = links.findIndex((item) => item.shortcut === shortcut);

  if (linkIndex !== -1) {
    links.splice(linkIndex, 1);
    saveLinksToFile();
    res.send("Go link deleted successfully.");
  } else {
    res.status(404).send("Shortcut not found.");
  }
});

// Get a specific go link by shortcut
app.get("/manage/get/:shortcut", (req, res) => {
  const { shortcut } = req.params;
  const link = links.find((item) => item.shortcut === shortcut);
  if (link) {
    res.json(link);
  } else {
    res.status(404).send("Shortcut not found.");
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
