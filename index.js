require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const authRouter = require('./routes/auth.route');
const httpStatusText = require('./utility/httpStatusText');
const path = require('path');


mongoose.connect(process.env.MONGO_URL).then(()=> {
  console.log('Connected to MongoDB'); 
})

const app = express();
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use(express.json());

app.use('/api', (req, res, next)=> {
  res.json({status: httpStatusText.SUCCESS, 
    message: 'Welcome to Courses Node.js API',
    code: 200,
    data: null
  });
});
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);
// get access token from refresh token
app.use('/api/auth', authRouter);


// global error handler
app.use((error, req, res, next)=> {
  return res.status(error.code || 500).json({status: error.status || httpStatusText.ERROR, message: error.message || 'Internal Server Error', code: error.code || 500, data: null});
})

// global path not found handler
app.all("*splat", (req, res)=> {
  return res.status(404).json({status: httpStatusText.ERROR, message: 'Path not found', code: 404, data: null});
})

app.listen(process.env.PORT || 4000, ()=> {
  console.log('Server is running on port', process.env.PORT || 4000);
})