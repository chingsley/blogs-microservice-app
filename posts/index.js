const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: { id, title },
    })
    .catch((err) => console.log(err.message));

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

const PORT = 4000;
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

app.listen(PORT, () => {
  console.log(YELLOW, "V55", RESET);
  console.log(
    "Running",
    YELLOW,
    "posts",
    RESET,
    "service on port",
    YELLOW,
    PORT,
    RESET
  );
});
