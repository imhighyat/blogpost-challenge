
const express = require('express');
const morgan = require('morgan');
const app = express();
let server;

//importing
const blogsRouter = require('./blogsRouter');

app.use(morgan('common'));
app.use('/blog-posts', blogsRouter);

function runServer() {
	server = app.listen(process.env.PORT || 8080, () => {
 		console.log(`Blogpost app is listening on port ${process.env.PORT || 8080}`);
	});
}

function closeServer() {
	server.close();
}

if(require.main === module){
	runServer();
}

module.exports = {app, runServer, closeServer};