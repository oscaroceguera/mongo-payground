const mongoose = require('mongoose')
const User = require('../src/user')
const Comment = require('../src/comments')
const BlogPost = require('../src/blogPost')
const assert = require('assert')

describe('Associations', () => {
  let joe, blogPost, comment;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' })
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Este es un contenido de un blogPost' })
    comment = new Comment({ content: 'Congrats on great post' })

    joe.blogPost.push(blogPost)
    blogPost.comments.push(comment)
    comment.user = joe

    // jose.save()
    // blogPost.save()
    // comment.save()

    Promise.all([
      joe.save(),
      blogPost.save(),
      comment.save()
    ]).then(() => done())
  })

  it('saves a relation between a user and blogpost', done => {
    User.findOne({ name: 'Joe' })
    .populate('blogPost')
      .then(user => {
        assert(user.blogPost[0].title === 'JS is Great')
        done()
      })
  })

  it('saves a full relation graph ', done => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPost',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then(user => {
        assert(user.name === 'Joe')
        assert(user.blogPost[0].title === 'JS is Great')
        assert(user.blogPost[0].comments[0].content === 'Congrats on great post')
        assert(user.blogPost[0].comments[0].user.name === 'Joe')
        done()
      })
  })
})