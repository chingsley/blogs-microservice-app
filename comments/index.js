const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;
    const postId = req.params.id;
    const comments = commentsByPostId[postId] || [];
    const newComment = { id: commentId, postId, content, status: "pending" };
    comments.push(newComment);
    commentsByPostId[req.params.id] = comments;

    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: newComment, // { ...newComment, postId: req.params.id },
      })
      .catch((err) => console.log(err.message));

    res.status(201).send(comments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: comment,
      })
      .catch((err) => console.log(err.message));
  }

  res.send({});
});

const PORT = 4001;
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

app.listen(PORT, () => {
  console.log(
    "Running",
    YELLOW,
    "comments",
    RESET,
    "service on port",
    YELLOW,
    PORT,
    RESET
  );
});
