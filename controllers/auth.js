import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
//Here the function is made asynchronous because we are calling to the database
export const register = async (req, res) => { //here the req is coming from frontend and res is that which we are sending to the frontend
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt(); //It will create a random salt provided by the bcrypt
    const passwordHash = await bcrypt.hash(password, salt); //We are encrypting the password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), //random value, later you fix it
      impressions: Math.floor(Math.random() * 10000),   //random value, later you fix it
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password); //here bcrypt will use the same salt to compare both the passwords i.e one that is received from the frontend and another that is stored on to the database
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password; //we are deleting so that it is not again send back to the frontend to the user
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  //Now in the company there are two situations either a company will be using third party authentication which will be very good at security which will be more secure than like this and generally those are preferred in the production level application for big companies, and alternative there will be a team who will handle the authentication 

  //so this is not a secure authentication it is simply the basics of authentication for normal project, to understand the working of authentication
