import { Request, Response, NextFunction } from "express";

export const getPosts = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  //   const posts = ["Post 1", "Post 2", "Post 3"]; // Example posts data
  res.status(200).json({ posts });
};

export const makePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
