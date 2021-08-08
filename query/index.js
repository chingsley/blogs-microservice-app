const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { postId } = data;
    posts[postId].comments.push(data);
  }
  if (type === "CommentUpdated") {
    const { postId, id } = data;
    const comments = posts[postId].comments;
    const comment = comments.find((comment) => comment.id === id);
    for (const key in comment) {
      comment[key] = data[key];
    }
    // comment.status = status;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

const PORT = 4002;
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

app.listen(PORT, async () => {
  console.log(
    "Running",
    YELLOW,
    "query service",
    RESET,
    "service on port",
    YELLOW,
    PORT,
    RESET
  );
  try {
    const EVENT_BUS_PORT = 4005;
    const res = await axios.get(`http://localhost:${EVENT_BUS_PORT}/events`);

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

/**
 * 
 * app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const res = await axios.get("http://localhost:4005/events");
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
 */
