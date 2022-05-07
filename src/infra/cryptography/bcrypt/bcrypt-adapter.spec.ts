import bcrypt from 'bcrypt'

import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash')
  },
  async compare (): Promise<boolean> {
    const p = await Promise.resolve(true)
    return p
  }
}))

const SALT = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(SALT)
}

describe('BCrypt Adapter', () => {
  describe('hash()', () => {
    test('should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })

    test('should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('should throw if hash throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
        return await Promise.resolve(false)
      })
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('should throw if compare throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
