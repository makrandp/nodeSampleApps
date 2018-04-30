const express = require('express');
const router = express.Router();

const Article = require('../models/Article.js');

router.get('/', (req, res, next) => {
  Article.getArticles((err, articles) => {
    res.render('index', {
      title: 'Index',
      articles: articles
    });
  }, 4);
});

module.exports = router;
