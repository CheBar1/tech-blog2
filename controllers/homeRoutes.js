// set up imports
const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// set up home route for all posts
router.get('/', async (req, res) => {
  console.log('get route hit homeRoutes');
  try {
// get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

// serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

// pass serialized data into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in,
      username: req.session.username,
    });
  } catch (err) {
    console.log('There is an error');
    res.status(500).json(err);
  }
});

// set up home route for single post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
// get single post and JOIN with user data
    const postData = await Post.findOne({
      where: {id: req.params.id},
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
          include: [
            {
            model: User,
            attributes: ['username'],
            },
          ],
        },
      ],
    })

    const post = postData.get({ plain: true });

    res.render('single-post', {
      post,
      logged_in: req.session.logged_in,
      username: req.session.username,
    });
  } catch (err) {
    console.log('There is an error');
    res.status(500).json(err);
  }
});

router.get('/posts-comments', (req, res) => {
  Post.findOne({
    where: {id: req.params.id},
    attributes: ['id', 'content', 'title', 'created_at'],
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
    .then((postData) => {
      if (postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      const post = postData.get({ plain: true });

      res.render('posts-comments', {
        post,
        logged_in: req.session.logged_in,
        username: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req,res) => {
  if (req.session.logged_in){
    res.redirect('dashboard');
    return;
  }
  res.render('signup');
});

module.exports = router;