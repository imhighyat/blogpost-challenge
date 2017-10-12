const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//importing the BlogPosts model
const {BlogPosts} = require('./models');

BlogPosts.create('How to dance', 'Drink lots of vodka. Wait for it to kick in. Dance.', 'Hayat Mazz', 'October 12, 2017');
BlogPosts.create('How to sing', 'Vocalize. Drink ginger tea. Pick up a hairbrush as your microphone. Sing your heart out.', 'Hayat Mazz', 'September 7, 2017');
BlogPosts.create('How to be cool', 'Wear hip clothes. Put make up on. Spray lots of perfume.', 'Hayat Mazz', 'November 22, 2017');
BlogPosts.create('How to code', 'Turn on computer. Open Sublime. Stare at the screen for 2 hours. Go to bed and take a nap.', 'Hayat Mazz', 'July 29, 2017');
BlogPosts.create('How to be a cat', 'Scratch your owners face. Sit on laptops. Ignore everyone. Be mean', 'Hayat Mazz', 'May 15, 2017');

router.get('/', (req, res) => {
	//will get all the Blogposts existing
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	//make sure that the required info are there
	//if not, respond an error
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
  	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in your request.`;
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
  	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  	res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
	//make sure that the required info are there
	//if not, respond an error
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
  	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in your request.`;
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
  	//check if the id does not match any of the id's in the blogposts collection
  	//then send the error message
  	if (req.params.id !== req.body.id) {
  		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
  		console.error(message);
    	return res.status(400).send(message);
  	}
  	//otherwise log the update and update the collection
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

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted shopping list item \`${req.params.id}\``);
	res.status(204).end();
});

module.exports = router;
