import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

import { MongoHelper } from '../../infra/db/helpers/mongo-helper'

import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 204 on create a survey with valid token', async () => {
      const password = await hash('123456789', 12)
      const result = await accountCollection.insertOne({
        name: 'Some Name',
        email: 'some@example.com',
        password,
        role: 'admin'
      })
      const account = await accountCollection.findOne(result.insertedId)
      const accountId = account._id
      const accessToken = sign({ id: accountId }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: accountId }
        ,
        {
          $set: {
            accessToken
          }
        }
      )

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any question',
          answers: [{
            image: 'any image',
            answer: 'any answer'
          }, {
            answer: 'any other answer'
          }]
        })
        .expect(204)
    })

    test('should return 403 on create a survey without x-access-token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any question',
          answers: [{
            image: 'any image',
            answer: 'any answer'
          }, {
            answer: 'any other answer'
          }]
        })
        .expect(403)
    })
  })
})
