const mongoose = require('mongoose')
const Users = require('../dbUsers')

//Get users list
const getUsers = async (req,res) => {
  try {
    const allUsers = await Users.find({}).sort({createdAt: -1})
    res.status(200).send(allUsers)
  }
  catch (err) {
    res.status(400).send(err.message)
  }
}

//Add user to the list
const createUser = async (req,res) => {
  const dbUser = req.body
  try {
    const newUser = await Users.create({
        _id: new mongoose.Types.ObjectId(), // Generate a unique ObjectId for _id
        myId: dbUser.myId, // Provide the value for the myId field
        userName: dbUser.userName,
        email: dbUser.email,
        id: dbUser.id,
        phoneNumber: dbUser.phoneNumber,
        ip: dbUser.ip,
      })
    console.log('newUser', newUser)
    res.status(201).send(newUser)
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

//delete one user from the list
const deleteUser = async (req,res) => {
  const id = req.body._id
  console.log('backend id', id)
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`The id: ${id} was not found`)
  }
  try {
    const deleteUser = await Users.findOneAndDelete({_id: id})
    res.status(201).send(deleteUser)
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

//delete all users list
const deleteAllUsers = async (req,res) => {
  try {
    const deleteAllUsers = await Users.deleteMany({})
    res.status(200).send(deleteAllUsers)
  }
  catch (err) {
    res.status(400).send(err.message)
  }
}



module.exports = {getUsers, createUser, deleteUser, deleteAllUsers}