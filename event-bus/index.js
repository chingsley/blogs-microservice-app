const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const ports = {
  postsService: 4000,
  commentsService: 4001,
  queryService: 4002,
  moderationService: 4003,
};

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  axios
    .post(`http://posts-clusterip-srv:${ports.postsService}/events`, event)
    .catch((err) => console.log(err.message));
  axios
    .post(`http://comments-srv:${ports.commentsService}/events`, event)
    .catch((err) => console.log(err.message));
  axios
    .post(`http://query-srv:${ports.queryService}/events`, event)
    .catch((err) => console.log(err.message));
  axios
    .post(`http://moderation-srv:${ports.moderationService}/events`, event)
    .catch((err) => console.log(err.message));

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

const PORT = 4005;
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

app.listen(PORT, () => {
  console.log(
    "Running",
    YELLOW,
    "event-bus",
    RESET,
    "on port",
    YELLOW,
    PORT,
    RESET
  );
});
