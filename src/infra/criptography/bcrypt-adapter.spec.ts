import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>((resolve) => resolve('hash'))
  }
}))

describe('BCrypt Adapter', () => {
  test('should call BCrypt with correct values', async () => {
    const SALT = 12
    const sut = new BCryptAdapter(SALT)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  test('should return a hash on success', async () => {
    const SALT = 12
    const sut = new BCryptAdapter(SALT)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
