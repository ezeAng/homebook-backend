import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import { getAllUsers, getUserById, createUser, getAllProfiles, getUserLikes, getAllLikes, getUserByUsername } from "./database.js";

const app = express();


app.use(express.json());

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

app.post('/users/login', async (req, res) => {
  //Auth User
  const username = req.body.username;
  const userRes = await getUserByUsername(username);
  if (userRes == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    console.log(req.body.password);
    console.log(userRes.password);
    if (await bcrypt.compare(req.body.password, userRes.password)) {
      const user = { name : username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.send('Not allowed');
    }
  } catch(e) {
    console.log(`Error login: ${e}`);
    res.status(500).send();
  }
})

app.post("/users",async (req, res) => {
  //hash password
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { 
      username: req.body.username,
      name: req.body.name, 
      email: req.body.email,
      password: hashedPassword 
    }
    await createUser(
      user.username, 
      user.name, 
      user.email, 
      user.password
    );
    res.status(201).send(user);
  } catch(e) {
    console.log(`Error auth: ${e}`);
    res.status(500).send();
  }

  
});

app.get("/users/:id",async (req, res) => {
  const id = req.params.id;
  const user = await getUserById(id);
  res.send(user);
});

//Likes
app.get('/likes', authenticateToken, async (req, res) => {
  const user_id = await getUserByUsername(req.user.name);
  const likes = await getUserLikes(user_id);
  res.json(likes)
})

//Profiles
app.get("/profiles",async (req, res) => {
  const profiles = await getAllProfiles();
  res.send(profiles);
});



//Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

