import { Collection } from 'mongodb'
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
      answer: 'any answer'
    }, {
      answer: 'other answer'
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
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('should update a survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const resp = await surveyResultCollection.insertOne({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResultFound = await surveyResultCollection.findOne({ _id: resp.insertedId })
      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult.id).toEqual(surveyResultFound._id)
      expect(surveyResult.answer).toEqual(survey.answers[0].answer)
    })
  })
})
