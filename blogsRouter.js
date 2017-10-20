//requiring the express framework
const express = require('express');
//activating express routing method
const router = express.Router();
//middleware to parse data into objects
const bodyParser = require('body-parser');
//activating bodyParser's json method for posting and updating data
const jsonParser = bodyParser.json();

//importing the BlogPosts model
const {BlogPosts} = require('./models');

//creating a few entries
BlogPosts.create('How to dance', 'Drink lots of vodka. Wait for it to kick in. Dance.', 'Hayat Mazz', 'October 12, 2017');
BlogPosts.create('How to sing', 'Vocalize. Drink ginger tea. Pick up a hairbrush as your microphone. Sing your heart out.', 'Hayat Mazz', 'September 7, 2017');
BlogPosts.create('How to be cool', 'Wear hip clothes. Put make up on. Spray lots of perfume.', 'Hayat Mazz', 'November 22, 2017');
BlogPosts.create('How to code', 'Turn on computer. Open Sublime. Stare at the screen for 2 hours. Go to bed and take a nap.', 'Hayat Mazz', 'July 29, 2017');
BlogPosts.create('How to be a cat', 'Scratch your owners face. Sit on laptops. Ignore everyone. Be mean', 'Hayat Mazz', 'May 15, 2017');

//will get all the Blogposts existing
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

//creating a blogpost, using jsonParser
router.post('/', jsonParser, (req, res) => {
	//make sure that the required info are there
	//if not, respond a 400 and log the error in the console
  //and send in the error message
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
  	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in your request.`;
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
    //otherwise create the post using our model passing in the required info
    //then respond with a 201 and show the item that was posted
  	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  	res.status(201).json(item);
});

//updating a blogpost
//adding `:id` as a named parameter, so we know what we are updating
//using jsonParser
router.put('/:id', jsonParser, (req, res) => {
	//make sure that the required info are there
	//if not, respond a 400 and log the error in the console
  //and send in the error message
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
  	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in your request.`;
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
  	//check if the id does not match any of the 
    //id's in the blogposts collection
  	//then respond a 400 and log the error in the console
    //and send in the error message
  	if (req.params.id !== req.body.id) {
  		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
  		console.error(message);
    	return res.status(400).send(message);
  	}
  	//otherwise log the id being updated and update the collection
    //respond with 204
  	console.log(`Updating shopping list item \`${req.params.id}\``);
  	BlogPosts.update({
    	id: req.params.id,
    	title: req.body.title,
    	content: req.body.content,
    	author: req.body.author,
    	publishDate: req.body.publishDate
  	});
  	res.status(204).end();
});

//deleting a blogpost with the id
//passing in the id of the post when requesting delete
//logging it to the console
//respond with 204
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted shopping list item \`${req.params.id}\``);
	res.status(204).end();
});

//exporting this module for consumption
module.exports = router;
