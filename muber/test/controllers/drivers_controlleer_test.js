const assert = require('assert')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')

const Driver = mongoose.model('driver')

describe('Drivers controller', () => {
  it('POST to /api/drivers creates a new driver', done => {
    Driver.count().then(count => {
      request(app)
      .post('/api/drivers')
      .send({ email: 'chanito@mail.com'})
      .end((err, response) => {
        Driver.count().then(newCount => {
          assert(count + 1 === newCount)
          done()
        })
      })
    })
  })

  it('PUT to /api/drivers/id edits and existing driver', done => {
    const driver = new Driver({
      email: 't@t.com',
      driving: false
    })

    driver.save()
      .then(() => {
        request(app)
          .put('/api/drivers/' + driver._id)
          .send({ driving: true })
          .end(() => {
            Driver.findOne({ email: 't@t.com'})
              .then(driver => {
                assert(driver.driving === true)
                done()
              })
          })
      })
  })

  it('DELETE to /api/drivers/id delete a driver', done => {
    const driver = new Driver({ email: 'test@estt.com' })

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: 'test@estt.com'})
            .then(driver => {
              assert(driver === null)
              done()
            })
        })
    })
  })

  it('GET to /api/drivers finds drivers in a location', done => {
    const seatleDriver = new Driver({
      email: 'seattle@mail.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    })
    
    const miamiDriver = new Driver({
      email: 'miami@mail.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.792] }
    })


    Promise.all([seatleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1)
            assert(response.body[0].email === 'miami@mail.com')
            
            done()
          })
      })
  })
})