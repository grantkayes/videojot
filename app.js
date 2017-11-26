const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

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
})

app.listen(port, () =>{
	console.log(`Server started on ${port}`);
});