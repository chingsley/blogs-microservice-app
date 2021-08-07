const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.toLowerCase().includes("orange")
      ? "rejected"
      : "approved";
    await axios
      .post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          ...data,
          status,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  res.send({});
});

const PORT = 4003;
const YELLOW = "\u001b[33m";
const RESET = "\u001b[0m";

app.listen(PORT, () => {
  console.log(
    "Running",
    YELLOW,
    "moderation service",
    RESET,
    "on port",
    YELLOW,
    PORT,
    RESET
  );
});
