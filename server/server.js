const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cors = require("cors");
// Load env variables
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();



// Middleware

// Routes
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/projects', require('./routes/projectRoutes.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
