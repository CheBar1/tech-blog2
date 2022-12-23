const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all posts, join with user data and display on dashboard
router.get('/', withAuth, (req, res) => {
// 'find all' from the Post model and store the results of the database query in a variable called dbPostData
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ['id', 'title', 'content', 'created_at'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((dbPostData) => {
  // serialize data so the template can read it
      const posts = dbPostData.map((post) => post.get({ plain: true }));
  // pass serialized data into dashboard template
      res.render('dashboard', {
        posts,
        logged_in: true,
        username: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// select a single post
router.get('/edit/:id', withAuth, (req, res) => {
// get single post and JOIN with user data
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'title', 'content', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
// serialize data so the template can read it
      const post = dbPostData.get({ plain: true });
      console.log('sending ' + req.session.username);
// pass to the template
      res.render('edit-post', {
        post,
        logged_in: true,
        username: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// new post
router.get('/new', (req, res) => {
  res.render('new-post', { username: req.session.username });
});

module.exports = router;
