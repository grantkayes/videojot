const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();

//Bluebird promise - avoid warning
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

//Add idea form route
app.get('/ideas/add', (req, res) =>{
	res.render('ideas/add');
});

app.listen(port, () =>{
	console.log(`Server started on ${port}`);
});