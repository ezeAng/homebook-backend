import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import { createUser, getAllProfiles, getUserLikes, getUserByUsername, getDesignerById, createProfile, getAllProfilesWithLikesByDesignerId } from "./database.js";

const app = express();
app.use(express.json());



// use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

//Login
app.post('/users/login', async (req, res) => {
  //Auth User
  const username = req.body.username;
  const userRes = await getUserByUsername(username);
  var id = userRes.id;
  var isDesigner = false;
  if (id) {
    const designer = await getDesignerById(id);
    if (designer) {
      isDesigner = true;
    }
  }
  

  if (userRes == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, userRes.password)) {
      const user = { name : userRes.username, rowId : userRes.id, isDesigner: isDesigner };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken, user: user });
    } else {
      res.send('Not allowed');
    }
  } catch(e) {
    console.log(`Error login: ${e}`);
    res.status(500).send();
  }
})

//Create user (Signup)
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

//Get a users Likes of profiles
app.get('users/likes', authenticateToken, async (req, res) => {
  console.log("GET LIKES:", req.user.rowId);
  //const user_id = await getUserByUsername(req.user.name).id;
  
  const likes = await getUserLikes(req.user.rowId);
  res.json(likes);
})

//Get Profiles to show
app.get("/profiles", async (req, res) => {
  //consider adding limit
  const profiles = await getAllProfiles();
  res.json(profiles);
});

//Get designer own Profiles to show
app.get("/users/profiles", authenticateToken, async (req, res) => {
  
  if (req.user.isDesigner) {
    const profiles = await getAllProfilesWithLikesByDesignerId(req.user.rowId);
    res.json(profiles);
  } else {
    res.send("Not a designer");
  }
  
});

//Add new profile
app.post("/profiles", async (req, res) => {
  try {
    const profile = { 
      profileName: req.body.profileName,
      authorId: req.body.authorId, 
      imageUrl: req.body.imageUrl,
      desc: req.body.desc 
    }
    await createProfile(
      profile.profileName,
      profile.authorId,
      profile.imageUrl,
      profile.desc
    );
    res.status(201).send(profile);
  } catch(e) {
    console.log("Error creating profile: ${e}",e);
  }

})



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

