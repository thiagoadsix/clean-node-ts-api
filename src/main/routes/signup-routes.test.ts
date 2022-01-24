import request from 'supertest'

import app from '../config/app'

describe('SignUp routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Some Name',
        email: 'some@example.com',
        password: 'somepassword',
        passwordConfirmation: 'somepassword'
      })
      .expect(200)
  })
})
