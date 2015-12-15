var express = require('express'),
    Post = require('../models/Post');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

router.get('/', needAuth, function(req, res, next) {
  Post.find({}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {posts: posts});
  });
});

router.get('/new', function(req, res, next) {
  res.render('posts/edit', {post: {}});
});

router.post('/', function(req, res, next) {
  var post = new Post({
    email: req.body.email,
    password: req.body.password,
    title: req.body.title,
    content: req.body.content
  });
  post.save(function(err, doc) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/' + doc.id);
  });
});

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    if (post) {
      post.read = post.read + 1;
      post.save(function(err) { });
      res.render('posts/show', {post: post});
    }
    return next(new Error('not found'));
  });
});

router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

router.put('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    if (req.body.password === post.password) {
      post.email = req.body.email;
      post.title = req.body.title;
      post.content = req.body.content;
      post.save(function(err) {
        res.redirect('/posts/' + req.params.id);
      });
    }
    res.redirect('back');
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/');
  });
});
module.exports = router;
