const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

//Use Bluebird promise as opposed to standard ES6
mongoose.Promise = require('bluebird');
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

const port = 5000;

//Handlebars middleware
app.engine('Handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'Handlebars');

//Bodyparser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

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

//Add idea route
app.get('/ideas', (req, res) =>{
	Idea.find({})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas:ideas
			});
		});
});

//Add idea
app.get('/ideas/add', (req, res) =>{
	res.render('ideas/add');
});

//Edit idea
app.get('/ideas/edit/:id', (req, res) =>{
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			res.render('ideas/edit', {
				idea:idea
			});
		});
});

//Process idea form submit
app.post('/ideas', (req, res) =>{
	let errors = [];

	if (!req.body.title) {
		errors.push({text: 'Please add a title'});
	}
	if (!req.body.details) {
		errors.push({text: 'Please add some details'});
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		};
		new Idea(newUser)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Video idea added');
				res.redirect('/ideas');
			});
	}
});

//Edit form process
app.put('/ideas/:id', (req, res) =>{
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
		.then(idea => {
			req.flash('success_msg', 'Video idea updated');
			res.redirect('/ideas');
		});
	});
});

//Delete form process
app.delete('/ideas/:id', (req, res) =>{
	Idea.remove({_id: req.params.id})
	.then(() => {
		req.flash('success_msg', 'Video idea removed'); 
		res.redirect('/ideas');
	});
});

app.listen(port, () =>{
	console.log(`Server started on ${port}`);
});