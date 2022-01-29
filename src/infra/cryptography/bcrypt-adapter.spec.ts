import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>((resolve) => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise<boolean>((resolve) => resolve(true))
  }
}))

const SALT = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(SALT)
}

describe('BCrypt Adapter', () => {
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

  test('should throw if BCrypt throws', async () => {
    const sut = makeSut()

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
