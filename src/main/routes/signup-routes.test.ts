import request from 'supertest'

import { MongoHelper } from '../../infra/db/helpers/mongo-helper'

import app from '../config/app'

describe('SignUp routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
