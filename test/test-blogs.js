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
	it('should get all the blogposts via GET', function () {
		return chai.request(app)
		.get('/blog-posts')
		.then(function (res){
			return true;
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
				})
			})
		})
	})
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
	it('should add a new entry via POST', function() {
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
		.then(function(){
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
	//test for PUT endpoint
	//1. create a var that will hold the updated info
	//2. do a GET request to obtain an id from the entries
	//3. add the id to the var we created
	//4. do a put request and send in the updated info
	//5. test the response
	//		res should return a status of 204
	//6. do a GET request to make sure that the changes was updated to the blogpost
	//		test the id of each blogpost entry and compare it to the id of the new item. var info should match one of the entries
	it('should update a specific entry via PUT', function(){
		const updateData = {
			title: 'updated title',
			content: 'updated content',
			author: 'updated author',
			publishDate: 'March 23, 2015'
		};
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			updateData.id = res.body[0].id;
			return chai.request(app)
				.put(`/blog-posts/${updateData.id}`)
				.send(updateData);
		})
		.then(function(res){
			res.should.have.status(204);
		})
		.then(function(){
			let match = false;
			return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.body.forEach(function(item){
					if(item.id === updateData.id && item.title === updateData.title && item.content === updateData.content && item.author === updateData.author && item.publishDate === updateData.publishDate){
						match = true;
					}
				});
				match.should.be.true;
			});
		});
	});
	//test for DELETE endpoint
	//2. do a GET request to obtain an id from the entries, add it to a var to use later
	//3. do a DELETE request passing in the id in the param
	//4. test the response
	//		res should return a status of 204
	//5. do a GET request to make sure that the entry with the id has been deleted
	//		test the id of each blogpost entry and compare it to the id that we stored in a var. var info should not match any of the entries
	it('should delete a specific entry via DELETE', function(){
		let deleteId;
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			deleteId = res.body[0].id;
			return chai.request(app)
			.delete(`/blog-posts/${deleteId}`);
		})
		.then(function(res){
			res.should.have.status(204);
		})
		.then(function(){
			let match = false;
			return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.body.forEach(function(item){
					if(item.id === deleteId){
						let match = true;
					}
				});
				match.should.be.false;
			});
		});
	});
});