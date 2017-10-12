
const express = require('express');
const morgan = require('morgan');
const app = express();

//importing
const blogsRouter = require('./blogsRouter');

app.use(morgan('common'));
app.use('/blog-posts', blogsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Blogpost app is listening on port ${process.env.PORT || 8080}`);
});