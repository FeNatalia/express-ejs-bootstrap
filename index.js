const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const redditData = require("./data/data.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let posts = [
  {
    postId: "1",
    photo:
      "https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGdyYXl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    username: "Ataskaan",
    title: "How to get organized",
    post: "1. Lorem ipsum, 2. Lorem ipsum 3. Blahblahblah",
  },
  {
    postId: "2",
    photo:
      "https://images.unsplash.com/photo-1648737119359-510d4f551382?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    username: "Nina",
    title: "How to practice chinese",
    post: "11. Lorem ipsum, 22. Lorem ipsum 33. Blahblahblah",
  },
  {
    postId: "3",
    photo:
      "https://images.unsplash.com/photo-1655326525660-3a68693a478a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    username: "Rex",
    title: "10 reasons to wake up early",
    post: "111. Lorem ipsum, 222. Lorem ipsum 333. Blahblahblah",
  },
];

// Post routes
app.get("/", (req, res) => {
  res.render("home", { name: "Home Page" });
});

app.get("/posts", (req, res) => {
  res.render("posts/index", { posts, name: "Posts" });
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new", { posts, name: "Add New" });
});

app.get("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const post = posts.find((e) => e.postId === postId);
  res.render("posts/show", { name: "Post", post });
});

app.get("/posts/:postId/edit", (req, res) => {
  const { postId } = req.params;
  const post = posts.find((e) => e.postId === postId);
  res.render("posts/edit", { name: "Edit", post });
});

app.post("/posts", (req, res) => {
  const { username, title, post, photo } = req.body;
  const postId = uuidv4();
  posts.push({ username, title, post, postId, photo });
  res.redirect("/posts");
});

app.patch("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const newPostText = req.body.post;
  const post = posts.find((e) => e.postId === postId);
  post.post = newPostText;
  res.redirect(`/posts/${post.postId}`);
});

app.delete("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  posts = posts.filter((e) => e.postId !== postId);
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
