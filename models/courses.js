// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// create a schema
var courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
      type: Object,
      required: true
    }
});

// the schema is useless so far
// we need to create a model using it
var Courses = mongoose.model('Course', courseSchema);

// make this available to our Node applications
module.exports = Courses;
