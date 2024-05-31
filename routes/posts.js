import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); //Home page which contains all the posts
router.get("/:userId/posts", verifyToken, getUserPosts); //posts of the relevant user

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); //for liking and unliking the post

export default router;