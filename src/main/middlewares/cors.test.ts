import request from 'supertest'
import app from '../config/app'

describe('CORS middleware', () => {
  test('should enable CORS', async () => {
    app.get('/test-cors', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-body-parser')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})