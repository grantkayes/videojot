if (process.env.NODE_ENV === 'production') {
	module.exports = {
		mongoURI: 'mongodb://<glk25>:<Weemiester!1>@ds125906.mlab.com:25906/vidjot-prod'
	}
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost/vidjot-dev'
	}
}