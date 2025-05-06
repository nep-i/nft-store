"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePost = exports.getPosts = void 0;
const getPosts = (req, res, next) => {
    //   const posts = ["Post 1", "Post 2", "Post 3"]; // Example posts data
    res.status(200).json({ posts });
};
exports.getPosts = getPosts;
const makePost = (req, res, next) => {
    const { title, content, imageUrl, creator } = req.body;
    const newPost = {
        id: Math.random().toString(),
        title,
        content,
        imageUrl,
        creator,
    };
    posts.push(newPost);
    res.status(201).json({ post: newPost });
};
exports.makePost = makePost;
// Dummy data
let posts = [
    {
        id: "p1",
        title: "First Post",
        content: "This is the content of the first post.",
        imageUrl: "https://via.placeholder.com/150",
        creator: {
            name: "DADADAA Doe",
        },
    },
    {
        id: "p2",
        title: "Second Post",
        content: "This is the content of the second post.",
        imageUrl: "https://via.placeholder.com/150",
        creator: {
            name: "Jane Doe",
        },
    },
];
