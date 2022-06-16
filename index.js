const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Post = require("./models/post");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/forumApp", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo connection is open!");
  })
  .catch((err) => {
    console.log("Mongo connection error!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const categories = ["Education", "Work", "Healthcare", "Legal"];

app.get("/", (req, res) => {
  res.render("home", { name: "Home Page" });
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find({});
  res.render("posts/index", { posts, name: "Posts" });
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new", { name: "Add New", categories });
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("posts/show", { name: "Post", post });
});

app.get("/posts/:id/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("posts/edit", { name: "Edit", post, categories });
});

app.post("/posts", async (req, res) => {
  const { username, title, post, photo, category } = req.body;
  const newPost = new Post({ username, title, post, photo, category });
  await newPost.save();
  res.redirect(`/posts/${newPost._id}`);
});

app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/posts/${post._id}`);
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/posts");
});

// app.get("/search", (req, res) => {
//   const { q } = req.query;
//   if (!q) {
//     res.send("nothing found if nothing searched");
//   }
//   console.log(q);
//   res.send(`<h1>Search results for ${q}</h1>`);
// });

app.get("*", (req, res) => {
  res.render("notfound", { name: "Not Found" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
