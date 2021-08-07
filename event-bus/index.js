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

app.post("/events", (req, res) => {
  const event = req.body;

  axios
    .post(`http://localhost:${ports.postsService}/events`, event)
    .catch((err) => console.log(err.message));
  axios
    .post(`http://localhost:${ports.commentsService}/events`, event)
    .catch((err) => console.log(err.message));
  axios
    .post(`http://localhost:${ports.queryService}/events`, event)
    .catch((err) => console.log(err.message));
  axios
    .post(`http://localhost:${ports.moderationService}/events`, event)
    .catch((err) => console.log(err.message));

  res.send({ status: "OK" });
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
