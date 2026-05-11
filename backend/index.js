require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const adminRoutes = require('./routes/admin.routes');
const mobilRoutes = require('./routes/mobil.routes');
const pemesananRoutes = require('./routes/pemesanan.routes');

app.use('/admin', adminRoutes);
app.use('/mobil', mobilRoutes);
app.use('/pemesanan', pemesananRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
