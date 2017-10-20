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
});