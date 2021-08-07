const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

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

  console.log("posts = ", posts);
  res.send({});
});

const PORT = 4002;
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

app.listen(PORT, () => {
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
});
