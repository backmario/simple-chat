const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

// MongoDB URI
const uri = `mongodb+srv://fullstack:${MONGO_PASSWORD}@cluster0.aprr1fa.mongodb.net/ChatApp?retryWrites=true&w=majority`;

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  friends: Array,
});

const User = mongoose.model("User", userSchema, "usernames");

// Function to connect to the database
async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.info("Database connected");
  } catch (e) {
    console.error("Connection error:", e);
    throw e; // Re-throw the error to be handled by the caller
  }
}

// Function to post a new user
async function postUser(userData) {
  try {
    await connectToDatabase();

    const newUser = new User(userData);
    await newUser.save();
    console.log("New user added:", newUser);

    mongoose.connection.close();
  } catch (e) {
    console.error(e);
    mongoose.connection.close();
  }
}

// Function to fetch all users
async function fetchUsers() {
  try {
    await connectToDatabase();

    const users = await User.find({});
    console.log("Users:", users);

    mongoose.connection.close();
  } catch (e) {
    console.error(e);
    mongoose.connection.close();
  }
}

// Example Usage:
/*postUser({
  username: "newUser123",
  email: "newuser123@example.com",
  friends: [],
});*/
fetchUsers();
