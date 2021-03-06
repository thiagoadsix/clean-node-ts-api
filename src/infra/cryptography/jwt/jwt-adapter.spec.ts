import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('token')
  },
  async verify (): Promise<string> {
    return Promise.resolve('any value')
  }
}))

type MakeSutTypes = {
  sut: JwtAdapter
}

const makeSut = (): MakeSutTypes => {
  const sut = new JwtAdapter('secret_key')

  return {
    sut
  }
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const { sut } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
    })

    test('should return a token on sign success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('token')
    })

    test('should throw if sign throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
      const error = sut.encrypt('any_id')
      await expect(error).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const { sut } = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any token')
      expect(verifySpy).toHaveBeenCalledWith('any token', 'secret_key')
    })

    test('should return a value on verify success', async () => {
      const { sut } = makeSut()
      const value = await sut.decrypt('any token')
      expect(value).toBe('any value')
    })

    test('should throw if verify throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
      const error = sut.decrypt('any token')
      await expect(error).rejects.toThrow()
    })
  })
})
