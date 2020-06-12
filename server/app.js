const express = require("express");
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
const path = require("path");
const fetch = require("node-fetch");
const moment = require("moment");

const port = process.env.PORT || 6000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client/build")));

const server = http.createServer(app);

const io = socket(server);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/getNews", (req, res) => {
  fetch(
    `https://newsapi.org/v2/everything?q=coronavirus${
      ` ${req.query.term}` || ""
    }&from=${moment()
      .subtract(14, "days")
      .format(
        "YYYY-MM-DD"
      )}&sortBy=relevancy&language=en&apiKey=a24bf4b7cea34b6c88e899238f856cfa`
  )
    .then((d) => d.json())
    .then((result) => {
      if (result.status !== "error") {
        res.json(result).status(200);
      } else {
        res
          .json({
            errorCode: 500,
            message: "There was a problem getting the news.",
          })
          .status(500);
      }
    })
    .catch((e) => {
      res
        .json({
          errorCode: 500,
          message: "There was a problem getting the news.",
        })
        .status(500);
    });
});

app.get("/mapData", (req, res) => {
  Promise.all([
    fetch("https://datahub.io/core/geo-countries/r/countries.geojson"),
    fetch("https://corona.lmao.ninja/v2/countries"),
  ])
    .then((values) => {
      Promise.all([values[0].json(), values[1].json()]).then((results) =>
        res.json({ geoJson: results[0], coronaJson: results[1] }).status(200)
      );
    })
    .catch((e) => {
      res
        .json({
          errorCode: 500,
          message: "There was a problem getting the data.",
        })
        .status(500);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});

app.post("/chat/sendMessage", (req, res) => {
  let params = req.query;
  if (
    !params.username ||
    !params.message ||
    !params.username_color ||
    !params.country
  ) {
    return res.send({ statusCode: 401, message: "Bad params." }).status(401);
  }
  io.emit("message", params);
  res.send({ statusCode: 200, message: "Sent." }).status(200);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
