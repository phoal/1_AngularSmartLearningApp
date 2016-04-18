var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
/*
var CourseMin = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  progress: Number,
  name: {
      type: String,
      required: true,
  },
  image: {
      type: String,
      required: true
  },
  category: {
      type: String,
      required: true
  }
});
*/
var User = new Schema({
    username: String,
    password: String,
    /* Courses is a MANY - MANY mapping
    ** However each student has FEW courses so start by embedding an array of
    ** MINIMISED docs which contain all the general details. To access the FULL
    ** course content, the course doc will have to be populated.
    */
    courses: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course'
        },
        prog: {
          mark : Number,
          scores : [Boolean],
          tries : [Number]
        }
      }
    ],
    curr : {
      type : mongoose.Schema.Types.ObjectId
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
