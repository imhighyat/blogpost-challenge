//requiring the express framework
const express = require('express');
//middleware for logging
const morgan = require('morgan');
//creating our express app and storing it in `app`
const app = express();
//when we open up the server, we will store the listening port here
let server;

//importing the blogsRouter module
const blogsRouter = require('./blogsRouter');

//using `morgan` everytime we use our app
app.use(morgan('common'));
//when directed to root/blog-posts, consume the blogsRouter module
app.use('/blog-posts', blogsRouter);

//function that will start the server
//for testing
function runServer() {
	//will store the listening port in the `server` variable
	server = app.listen(process.env.PORT || 8080, () => {
 		console.log(`Blogpost app is listening on port ${process.env.PORT || 8080}`);
	});
}

//function that will close the server
//for testing
function closeServer() {
	server.close();
}

//this makes sure that when this module is called, 
//we will start running the server
if(require.main === module){
	//make sure to catch any error if server won't run and log it
	runServer().catch(err => console.error(err));
}

//this exports our app, the runServer and closeServer functions
//for consumption of other modules
module.exports = {app, runServer, closeServer};