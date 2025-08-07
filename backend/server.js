const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();

const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use('/', postRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
