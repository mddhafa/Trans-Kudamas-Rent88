require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const adminRoutes = require('./routes/admin.routes');

app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
