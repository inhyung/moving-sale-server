const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

// let data = [];

// Middleware to parse JSON bodies
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Sample route
app.get("/", (req, res) => {
  res.send("Server for 'inhyung.github.io/moving-sale'");
});

// file system
const fs = require("fs");
const filePath = "data.json";
let data = {};
const nitem = 10;

// Check if the file exists
if (fs.existsSync(filePath)) {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Check if the file is empty
    if (fileContent.trim()) {
      // Parse the JSON content
      data = JSON.parse(fileContent);
      console.log("Data loaded from the saved file");
    } else {
      console.log("File is empty. Using default data.");
    }
  } catch (err) {
    console.error("Error reading or parsing the file:", err);
  }
} else {
  // initialization of waiting list
  for (let i = 0; i < nitem; i++) {
    data[i] = [];
  }
  console.log("File does not exist. Using default data");

  // default data to a new file
  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log("Default data written to a new file.");
  } catch (err) {
    console.error("Error writing default data to file:", err);
  }
}
// fs.writeFileSync(filePath, "");
// fs.unlinkSync(filePath);

// You can now use the `test` variable in your application

//
// let data = {
//   1: [{ name: "inhyung", number: "010291003", email: "xqe@na.com" }],
//   2: [{ name: "franny", number: "291314239", email: "ob@na.com" }],
//   3: [{ name: "three", number: "293231219", email: "ob@na.com" }],
//   4: [{ name: "four", number: "221412319", email: "ob@na.com" }],
//   5: [{ name: "five", number: "293123319", email: "ob@na.com" }],
//   6: [
//     {
//       name: "six",
//       number: "29319",
//       email: "ob@na.com",
//       date: "November 11 (Fri)",
//       reserved: true,
//     },
//     {
//       name: "six2",
//       number: "29319",
//       email: "ob@na.com",
//       date: "November 11 (Sat)",
//       reserved: false,
//     },
//     {
//       name: "six3",
//       number: "3413339361",
//       email: "ob@na.com",
//       date: "October 12 (Wed)",
//       reserved: true,
//     },
//   ],
// };

// transfer waiting list
app.post("/api/get_list", (req, res) => {
  const itemID = parseInt(req.body.id);
  res.json(data[itemID]);
});

// add waiting list
app.post("/api/add_list", (req, res) => {
  const input = req.body;
  const itemID = parseInt(input.item);
  // data.push(number);
  data[itemID].push({
    name: input.name,
    number: input.number.replace(/-/g, ""),
    email: input.email,
    date: input.date,
    reserved: true,
  });
  res.send(data[itemID]);
  // update back data
  fs.writeFileSync(filePath, JSON.stringify(data));
});

// remove waiting list
app.post("/api/remove_list", (req, res) => {
  const { id, which, password } = req.body;

  if (password == data[id][which].number.substr(-4)) {
    data[id][which].reserved = false;
    res.send({ result: true });
  } else {
    res.send({ result: false });
  }
  // update back data
  fs.writeFileSync(filePath, JSON.stringify(data));
});

// show waiting list
app.get("/api/show_list", (req, res) => {
  res.send(data);
});

// get waiting list
const path = require("path");
app.get("/api/get_list", (req, res) => {
  // file path
  const filePath = path.join(__dirname, "list.json");

  // write JSON data to file
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Internal Server Error");
    }

    // send the JSON file
    res.download(filePath, "list.json", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting the file:", unlinkErr);
        }
      });
    });
  });
});

// delete waiting list
app.get("/api/delete_list", (req, res) => {
  // // delete
  try {
    fs.unlinkSync(filePath);
    console.log("File deleted successfully");
  } catch (err) {
    console.error("Error deleting the file:", err);
  }
  res.send("Clear the data.");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
