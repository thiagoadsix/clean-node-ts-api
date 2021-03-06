import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/helpers/mongo-helper'
import { mockAccountRequest } from '@/domain/test'

import { AccountMongoRepository } from './account-mongo-repository'
import { AccountMapper } from './account-mongo-repository-mapper'

let accountCollection: Collection

describe('Account MongoDB Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAccountRequest())

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@example.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne(mockAccountRequest())

      const account = await sut.loadByEmail('any_email@example.com')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@example.com')
      expect(account.password).toBe('any_password')
    })

    test('should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('email@example.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAccountRequest())
      const account = await accountCollection.findOne(res.insertedId)
      const accountMapped = AccountMapper.accountMongoToAccountModel(account)
      expect(accountMapped['accessToken']).toBeFalsy()
      await sut.updateAccessToken(accountMapped.id, 'any_token')
      const accountFound = await accountCollection.findOne({ _id: accountMapped.id })
      expect(accountFound).toBeTruthy()
      expect(accountFound.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('should return an account on loadByToken without role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        accessToken: 'any token'
      })

      const account = await sut.loadByToken('any token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('name')
      expect(account.email).toBe('email@example.com')
      expect(account.password).toBe('password')
    })

    test('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        accessToken: 'any token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any token', 'admin')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('name')
      expect(account.email).toBe('email@example.com')
      expect(account.password).toBe('password')
    })

    test('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        accessToken: 'any token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('name')
      expect(account.email).toBe('email@example.com')
      expect(account.password).toBe('password')
    })

    test('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        accessToken: 'any token'
      })

      const account = await sut.loadByToken('any token', 'admin')

      expect(account).toBeFalsy()
    })

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('any token')

      expect(account).toBeFalsy()
    })
  })
})
