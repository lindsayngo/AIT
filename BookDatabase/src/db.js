// db.js
const mongoose = require('mongoose', { useNewUrlParser: true});
const URLSlugs = require('mongoose-url-slugs');
mongoose.set('useCreateIndex', true); //fix DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

//my schema goes here
//mongoDB collections: 2

const Review = new mongoose.Schema({
    rating: {type: Number, required: true},
    name: String,
    text: {type: String, required: true}
});

const Book = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    isbn: {type: String, required: true},
    reviews: [Review]
});


Book.plugin(URLSlugs('title author'));

//register the schema so mongoose knows about them
mongoose.model("Books", Book);
mongoose.model("Reviews", Review);

//connect to the database hw05
mongoose.connect('mongodb://localhost/hw05', { useNewUrlParser: true });