
const express = require('express');
// const router = express.Router();
const morgan = require('morgan');
const blogPostsRouter = require('./blogPostsRouter');

const app = express();

app.use(morgan('common'));

app.use('/my-blog', blogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});