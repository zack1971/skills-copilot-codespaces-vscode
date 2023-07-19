// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');

// Create a new comment
router.post('/posts/:post/comments', function(req, res, next) {
  // Create a new comment with the request body
  var comment = new Comment(req.body);
  // Set the comment's post
  comment.post = req.post;
  // Save the comment
  comment.save(function(err, comment) {
    if (err) { return next(err); }
    // Push the comment to the post's comments
    req.post.comments.push(comment);
    // Save the post
    req.post.save(function(err, post) {
      if (err) { return next(err); }
      // Respond with the comment
      res.json(comment);
    });
  });
});

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }
    req.comment = comment;
    return next();
  });
});

// Upvote a comment
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  // Upvote the comment
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    // Respond with the comment
    res.json(comment);
  });
});

// Downvote a comment
router.put('/posts/:post/comments/:comment/downvote', function(req, res, next) {
  // Downvote the comment
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }
    // Respond with the comment
    res.json(comment);
  });
});

module.exports = router;
