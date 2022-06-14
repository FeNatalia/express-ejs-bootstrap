const express = require("express");
const app = express();
const path = require("path");
const redditData = require("./data/data.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const posts = [
  {
    postId: 1,
    username: "Ataskaan",
    post: "How to get organized",
  },
  {
    postId: 2,
    username: "Nina",
    post: "How to practice chinese",
  },
  {
    postId: 3,
    username: "Rex",
    post: "10 reasons to wake up early",
  },
];

app.get("/", (req, res) => {
  res.render("home", { name: "Home Page" });
});

app.get("/posts", (req, res) => {
  res.render("posts/index", { posts, name: "Posts" });
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new", { posts, name: "Add New" });
});

app.post("/posts", (req, res) => {
  const { username, post } = req.body;
  console.log(req.body);
  posts.push({ username, post });
  res.redirect("/posts");
});

app.get("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const post = posts.find((e) => e.postId === parseInt(postId));
  console.log(post);
  res.render("posts/show", { name: "Post", post });
});

app.delete("/posts/:postId", (req, res) => {
  res.send("delete the posts");
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
