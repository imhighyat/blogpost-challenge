const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

//test for GET endpoint
//1. do a GET request for all entries
//2. test the response
//3. 
describe('blogposts GET endpoint', function () {
	before(function () {
		return runServer();
	});
	after(function () {
		return closeServer();
	});

	it('should get all the blogposts', function () {
		return chai.request(app)
		.get('/blog-posts')
		.then(function (res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.an('array');
			res.body.length.should.be.above(0);
		})
	});
});