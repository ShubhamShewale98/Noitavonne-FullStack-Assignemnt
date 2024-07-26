const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

 const upload = multer({ storage: storage });
// Routes
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const { createTicket } = require('./controllers/ticketController');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.post('/api/tickets/', authMiddleware, upload.array('attachments', 10), createTicket);

app.get("/",(req,res)=>{
  res.send(`Hello ${process.env.JWT_SECRET} User Server Sucessfully Running On Port : ${PORT}`)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
