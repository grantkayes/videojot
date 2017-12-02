const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const port = 5000;

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Use Bluebird promise as opposed to standard ES6
mongoose.Promise = require('bluebird');

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//Handlebars middleware
app.engine('Handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'Handlebars');

//Bodyparser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware
app.use(methodOverride('_method'));

//Express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());

//Global variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//Index route
app.get('/', (req, res) =>{
	const title = 'Welcome1';
	res.render('index', {
	  title: title
	});
});

//About route
app.get('/about', (req, res) =>{
	res.render('about');
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () =>{
	console.log(`Server started on ${port}`);
});