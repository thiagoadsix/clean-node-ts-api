import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>((resolve) => resolve('hash'))
  }
}))

const SALT = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(SALT)
}

describe('BCrypt Adapter', () => {
  test('should call BCrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  test('should return a hash on success', async () => {
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
})
