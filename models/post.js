const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POST_PATH = path.join('/uploads/posts/images');

const postSchema = mongoose.Schema ( {
    content : {
        type : String,
        required : true
    },
    image : {
        type : String,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // include the array of ids of all comments in this post schema itself
    comments : [ 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ],
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }

    ]
}, {
    timestamps : true
})



  // static
  postSchema.statics.postPath = POST_PATH;

  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..',POST_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

  postSchema.statics.uploadedPost = multer({storage: storage}).single('postimage');


const Post = mongoose.model('Post', postSchema);

module.exports = Post;

