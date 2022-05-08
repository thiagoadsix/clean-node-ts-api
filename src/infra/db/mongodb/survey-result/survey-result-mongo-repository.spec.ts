import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'

import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

import { SurveyMapper } from '../survey/survey-mongo-repository-mapper'
import { AccountMapper } from '../account/account-mongo-repository-mapper'

import {
  AccountModel,
  SurveyModel
} from './survey-result-mongo-repository-protocols'

let surveyResultCollection: Collection
let surveyCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const resp = await surveyCollection.insertOne({
    question: 'any question',
    answers: [{
      image: 'any image',
      answer: 'any answer 1'
    }, {
      answer: 'other answer 2'
    }, {
      answer: 'other answer 3'
    }],
    date: new Date()
  })
  const survey = await surveyCollection.findOne({ _id: resp.insertedId })
  return SurveyMapper.surveyMongoToSurveyModel(survey)
}

const makeAccount = async (): Promise<AccountModel> => {
  const resp = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  const account = await accountCollection.findOne({ _id: resp.insertedId })
  return AccountMapper.accountMongoToAccountModel(account)
}

describe('Survey Result MongoDB Repository', () => {
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('should save a survey result if its new', async () => {
      const survey = await makeSurvey()
      console.log({ survey })
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      console.log({ surveyResult })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toEqual(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })

    test('should update a survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(account.id),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toEqual(survey.answers[1].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })
  })

  describe('loadBySurveyId()', () => {
    test('should load a survey result with correct value', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await surveyResultCollection.insertMany([
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date()
        },
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})
