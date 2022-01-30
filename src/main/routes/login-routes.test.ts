import request from 'supertest'

import { MongoHelper } from '../../infra/db/helpers/mongo-helper'

import app from '../config/app'

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
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
})
