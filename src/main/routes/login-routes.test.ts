import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

import { MongoHelper } from '../../infra/db/helpers/mongo-helper'

import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
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

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('somepassword', 12)
      await accountCollection.insertOne({
        name: 'Some Name',
        email: 'some@example.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'some@example.com',
          password: 'somepassword'
        })
        .expect(200)
    })
  })
})
