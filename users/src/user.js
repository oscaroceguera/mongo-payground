const mongoose = require('mongoose')
const PostSchema = require('./post')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  posts: [PostSchema],
  blogPost: [{
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  }],
  likes: Number
})

UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
})

UserSchema.pre('remove', function (next) {

  const BlogPost = mongoose.model('blogPost')
  // this === joe

  BlogPost.remove({ _id: { $in: this.blogPost } })
    .then(() => next())
})

const User = mongoose.model('user', UserSchema)

module.exports = User;