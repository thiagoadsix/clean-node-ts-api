import { Collection } from 'mongodb'
import MockDate from 'mockdate'

import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    test('should create a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any question',
        answers: [{
          image: 'any image',
          answer: 'any answer'
        }, {
          answer: 'other answer'
        }],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({ question: 'any question' })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      await surveyCollection.insertMany([{
        question: 'any question 1',
        answers: [{
          image: 'any image',
          answer: 'any answer'
        }, {
          answer: 'other answer'
        }],
        date: new Date()
      }, {
        question: 'any question 2',
        answers: [{
          image: 'any image',
          answer: 'any answer'
        }, {
          answer: 'other answer'
        }],
        date: new Date()
      }])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any question 1')
      expect(surveys[1].question).toBe('any question 2')
    })

    test('should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const resp = await surveyCollection.insertOne({
        question: 'any question 1',
        answers: [{
          image: 'any image',
          answer: 'any answer'
        }, {
          answer: 'other answer'
        }],
        date: new Date()
      })
      const surveyMongo = await surveyCollection.findOne({ _id: resp.insertedId })
      const id = surveyMongo._id.toString()
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey.question).toBeTruthy()
    })
  })
})
