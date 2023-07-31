const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const csvParser = require('csv-parser')
const fs = require('fs')

dotenv.config()

const { getUsers, createUser, deleteUser, deleteAllUsers } = require('./controllers/usersController')

async function startServer() {
  const app = express()
  const port = process.env.PORT || 8000
  const connectionURL = process.env.MONGO_URI

  app.use(express.json())
  app.use(cors())

  try {
    await mongoose.connect(connectionURL)
    console.log('Connected to MongoDB')

    // CSV loading
    const csvFilePath = './csv-data.csv'
    const collection = mongoose.connection.collection('users')

    const dataArray = []
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        dataArray.push(row)
      })
      .on('end', async () => {
        try {
          if (dataArray.length > 0) {
            await collection.insertMany(dataArray)
            console.log('CSV data successfully loaded to MongoDB.')
          } else {
            console.log('CSV file is empty or contains no data.')
          }
        } catch (error) {
          console.error('Error loading CSV data to MongoDB:', error)
        }
      })

    app.listen(port, () => {
      console.log(`Listening to port ${port}`)
    })
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }

  app.get('/users', getUsers)
  app.post('/users', createUser)
  app.delete('/users/:id', deleteUser)
  app.delete('/users', deleteAllUsers)
}

startServer()
