const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

const dbUrl = 'mongodb+srv://adminbookhaven:8976BookHaven@cluster0.netai.mongodb.net/sample_analytics?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(dbUrl).then(()=> console.log('mongoose connected')).catch(err => console.log(err))
  

// Start the server
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});


// Define a schema and model for the sample_analytics collection
const customersSchema = mongoose.Schema({
  name: String,
  address: String,
  email: String,
  // Add other fields as needed
});

const Customers = mongoose.model('Customers', customersSchema);

// Define a simple route to get customers data
app.get('/', (req, res) => {
  Customers.find()
    .then(customers => res.json(customers))
    .catch(err => console.log(err));
});

