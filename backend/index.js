require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const mobilRoutes = require('./routes/mobil.routes');
const pemesananRoutes = require('./routes/pemesanan.routes');

app.use('/admin', adminRoutes);
app.use('/contact-settings', contactRoutes);
app.use('/mobil', mobilRoutes);
app.use('/pemesanan', pemesananRoutes);

app.get("/", (req, res) => {
  res.send("Backend Agil Rent is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
