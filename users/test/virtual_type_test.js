const assert = require('assert')
const User = require('../src/user')

describe('Virtual type', () => {
  it('postCount return number of posts', (done) => {
    const joe = new User({
      name: 'Joe',
      posts: [{ title: 'PostTile' }]
    })

    joe.save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(joe.postCount === 1)
        done()
      })
  })
})