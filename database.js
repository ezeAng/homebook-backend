import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();


export async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

export async function createUser(username, name, email, password) {
  const query = `
    INSERT INTO users (username, name, email, password)
    VALUES (?, ?, ?, ?)
  `;

  const values = [username, name, email, password];
  
  // Handle null email
  const processedValues = values.map(v => v === "" ? null : v);

  const [result] = await pool.query(query, processedValues);
  return result.insertId;
}


export async function getUserByEmail(email) {
  const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE email = ?
  `, [email]);
  return rows[0];
}

export async function getUserById(id) {
  const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE id = ?
  `, [id]);
  return rows[0];
}

export async function getUserByUsername(username) {
  const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE username = ?
  `, [username]);
  return rows[0];
}



export async function getAllLikes() {
  const [rows] = await pool.query(`
    SELECT *
    FROM Likes
  `);
  return rows;
}

export async function getUserLikes(id) {
  const [rows] = await pool.query(`
    SELECT *
    FROM Likes
    WHERE user_id = ?
  `, [id]);
  return rows;
}

export async function addUserLikes(userId, profileId) {
  const [rows] = await pool.query(`
    INSERT INTO Likes (user_id, profile_id)
    VALUES (?, ?)
  `, [userId, profileId]);
  return rows[0];
}

export async function getAllDesigners() {
  const [rows] = await pool.query(`
    SELECT * 
    FROM designers
  `);
  return rows[0];
}

export async function getDesignerById(user_id) {
  const [rows] = await pool.query(`
    SELECT *
    FROM designers
    WHERE user_id = ?
  `, [user_id]);
  return rows[0];
}


export async function getAllProfiles() {
  const [rows] = await pool.query(`
    SELECT * 
    FROM profiles
  `);
  return rows[0];
}

export async function getSubsetProfiles(num) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM profiles
    LIMIT num = ?
  `, [num]);
  return rows[0];
}

export async function createProfile(profileName, authorId, imageUrl, desc) {
  const [result] = await pool.query(`
    INSERT INTO profiles (profile_name, author_id, image_url, description)
    VALUES (?, ?, ?, ?)
  `, [profileName, authorId, imageUrl, desc])
  return result.insertId;
}

export async function createDesigner(userId, about, lowerRangePay, higherRangePay, firmId) {
  const [rows] = await pool.query(`
    INSERT INTO designers (userId, about,lower_range_pay, higher_range_pay, firm_id)
    VALUES (?, ?, ?, ?, ?)
  `, [userId, about, lowerRangePay, higherRangePay, firmId]);
  return rows[0];
}

export async function createFirm(firmName, address, phone, email) {
  const [rows] = await pool.query(`
    INSERT INTO firms (firm_name, address, phone, email)
    VALUES (?, ?, ?, ?)
  `, [firmName, address, phone, email]);
  return rows[0];
}







