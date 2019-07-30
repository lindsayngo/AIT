
require('./db');
const mongoose = require('mongoose');
const Books = mongoose.model('Books');
const Reviews = mongoose.model('Reviews');
const session = require('express-session');

mongoose.set('useFindAndModify', false);

const express = require('express');
const app = express();

app.use(session({secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true}
));

app.set('view engine', 'hbs');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

const sanitize = require('mongo-sanitize');

app.get('/', function(req, res){
   res.redirect('/books');
});

app.get('/books', function(req, res){
  if(req.session.count){
    req.session.count++;
  } else{
    req.session.count = 1;
  }
  const obj = {};
  obj[req.query.category] = req.query.filterby;
  
  if(typeof req.query.category === 'undefined' || typeof req.query.filterby === 'undefined'
  || req.query.category === ''||req.query.filterby === ''){
    Books.find(function(err, books) {
      res.render('books', {books: books, visits: req.session.count, slug: books.slug});
    });
  } else {
    Books.find(obj, function(err, books) {
      if(err || books.length === 0) {
        res.render('books', {error: "Sorry, no books found", visits: req.session.count, slug: books.slug});
      }
      else{
        res.render('books', {books: books, visits: req.session.count, slug: books.slug});
      }
    });
  }
});

app.get('/books-new', function(req, res){
  if(req.session.count){
    req.session.count++;
  }
    res.render('add',{visits: req.session.count });
});

app.post('/books-new', function(req, res){
    if(req.body.title === '' || req.body.author === '' || req.body.isbn === ''){
      res.render('add', {'error': 'Sorry, try again', visits: req.session.count });
    } else {
      const newBook = new Books({
        title: sanitize(req.body.title),
        author: sanitize(req.body.author),
        isbn: sanitize(req.body.isbn)
      });
      newBook.save(); 
    }
   
});

app.get('/books/:slug', function(req, res){
  if(req.session.count){
    req.session.count++;
  }
  const obj = {};
  obj['slug'] = req.params.slug;

  //find book based off its slug
  Books.find(obj, function(err, books){
    if(err){
      res.send(404, 'Sorry, Page Was Not Found');
    } else {
      let noRevs;
      if(books[0].reviews.length === 0){
          noRevs = "No reviews yet!";
      }
      
      res.render('details', {books: books,
        title: books[0]['title'],
        author: books[0]['author'],
        slug: req.params.slug,
        reviews: books[0]['reviews'],
        noRevs: noRevs,
        visits: req.session.count
      });
    }//end of else 
  });//end of Books.find
  
});

app.post('/books/:slug/comments', function(req, res){

  //if person tries to review nothing, don't add a new review
  if(req.body.review === ''){
    // req.body.review = 'No comment.';
    const str = '/books/' + sanitize(req.params.slug.split('/')[0]);
    res.redirect(str);
  }

  else{

    const newReview = new Reviews({
      rating: sanitize(req.body.rating),
      name: sanitize(req.body.name),
      text: sanitize(req.body.review)
    });
    // newReview.save((err, newBook, count) => {
    //     // console.log(err, newBook, count);
    // });
    // console.log(newReview);

    const obj = {};
    obj['slug'] = sanitize(req.params.slug);

    //find book based off its slug, UPDATE ITS REVIEWS
    Books.findOneAndUpdate(sanitize(obj), {$push: {reviews: newReview} }, function(err, books, count){
        console.log(err, books, count);
      if(err){
        res.status(404).send('Sorry, Page Was Not Found'); 
      } else {
        // let noRevs = "";
        // if(books['reviews'].length === 0){
        //     noRevs = "No reviews yet!";
        // }
        const str = '/books/' + req.params.slug;
        res.redirect(str);
          // res.render('details',
          //   {title: books['title'],
          //   author: books['author'],
          //   slug: req.params.slug,
          //   reviews: books['reviews'],
          //   rev: rev,
          //   visits: req.session.count
          // });
      }//end of else
    });//end of Books.find

  }//end of big else
     

});


//Handlebars registering setup, ifeq function from:
//https://stackoverflow.com/questions/41423727/handlebars-registerhelper-serverside-with-expressjs
const exphbs = require('express-handlebars');
const string = path.join(__dirname, 'views');
app.engine('.hbs', exphbs({
  layoutsDir: string,
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    ifeq: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    }
  }
}));


app.listen(3000);
