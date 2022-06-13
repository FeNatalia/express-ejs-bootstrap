const express = require("express");
const app = express();
const path = require("path");
const redditData = require("./data/data.json");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home", { name: "Home Page" });
});

app.get("/cats", (req, res) => {
  const cats = ["Slipsen", "Cookie", "Baldrick"];
  res.render("cats", { name: "Cat Names", cats });
});

app.get("/random", (req, res) => {
  const num = Math.floor(Math.random() * 1000) + 1;
  res.render("random", { num, name: "Random Number" });
});

app.get("/r/:subreddit", (req, res) => {
  const { subreddit } = req.params;
  const data = redditData[subreddit];
  if (data) {
    res.render("subreddit", { ...data });
  } else {
    res.render("notfound", { subreddit });
  }
});

app.get("/r/:subreddit/:postId", (req, res) => {
  const { subreddit, postId } = req.params;
  res.send(`<h1>Viewing ${postId} in the ${subreddit} subreddit</h1>`);
});

app.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.send("nothing found if nothing searched");
  }
  console.log(q);
  res.send(`<h1>Search results for ${q}</h1>`);
});

app.get("*", (req, res) => {
  res.send({ message: "There is no such path" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
