const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('blogposts GET endpoint', function () {
	//run the server before the tests
	before(function () {
		return runServer();
	});
	//close the server after tests
	after(function () {
		return closeServer();
	});
	//test for GET endpoint
	//1. do a GET request for all entries
	//2. test the response
	//		res should return a status of 200
	//		res should be in json format
	//		res.body should be array
	//		length of res.body should be at least 1
	//		each item of the res.body should have the required keys
	//		each item of the res.body should be an object
	//		keys should have values with length of at least 1
	it('should get all the blogposts', function () {
		return chai.request(app)
		.get('/blog-posts')
		.then(function (res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.an('array');
			res.body.length.should.be.above(0);
			const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
			res.body.forEach(function(item){
				item.should.be.a('object');
				item.should.include.keys(expectedKeys);
				Object.keys(item).forEach(function(key){
					item[key].length.should.be.above(0);
				});
			});
		});
	});
	//test for POST endpoint
	//1. create a var to store the new info 
	//2. do a POST request, and send in the new item
	//3. test the response
	//		res should return a status of 201
	//		res should be in json format
	//		res.body should be an object
	//		res.body should not be null
	//		the id of the blog should not be null
	//		assign the generated id to the var and res.body should be deep equal to the new item posted
	//		res.body should have the required keys
	//		keys should have values with length of at least 1
	//		if required keys are missing, respond with status 400 and send the error message
	//4. do a GET request to make sure that the newly posted item was added
	//		test the id of each blogpost entry and compare it to the id of the new item. one should match and return true
	it('should add a new entry on POST', function() {
		const newItem = {
			title: 'new blog post',
			content: 'new content',
			author: 'new author',
			publishDate: 'January 16, 2017'
		};
		return chai.request(app)
		.post('/blog-posts')
		.send(newItem)
		.then(function(res){
			const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.not.be.null;
			res.body.id.should.not.be.null;
			res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
			res.body.should.include.keys(expectedKeys);
			res.body.title.length.should.be.above(0);
			res.body.content.length.should.be.above(0);
			res.body.author.length.should.be.above(0);
			res.body.publishDate.length.should.be.above(0);
			//if(!(res.body.should.include.keys(expectedKeys))){
			//	res.should.have.status(400);
			//}
		})
		.then(function(res){
			let match = false;
			return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.body.forEach(function(item){
				if(item.id === newItem.id){
					match = true;
				}});
				match.should.be.true;
			});
		});
	});
});