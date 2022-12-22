// set up imports
const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

// get all posts, join with user data and display on dashboard
router.get('/', withAuth, async (req, res) => {
  console.log('get route hit - dashboardRoutes');
  try {
// 'find all' from the Post model and store the results of the database query in a variable called postData
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
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

// pass serialized data into dashboard template
    res.render('dashboard', { 
      posts, 
      logged_in: true,
      username: req.session.username, 
    });
  } catch (err) {
    console.log('There is an error');
    res.status(500).json(err);
  }
});

// select a single post
router.get('/edit/:id', withAuth, async (req, res) => {
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

// serialize data so the template can read it
    const post = postData.get({ plain: true });
// pass to the template
    res.render('edit-post', {
      post,
      logged_in: true,
      username: req.session.username,
    });
  } catch (err) {
    console.log('There is an error');
    res.status(500).json(err);
  }
});

// new post
router.get('/new', (req, res) => {
   res.render('new-post', {username: req.session.username});
  }); 

module.exports = router;