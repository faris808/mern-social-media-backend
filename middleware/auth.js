import jwt from "jsonwebtoken";


//Here we are handling the part of authorization
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); //here we are grabing the token from the req.header named authorization which we will set in the frontend

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};