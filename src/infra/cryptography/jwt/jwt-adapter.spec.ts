import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise<string>((resolve) => resolve('token'))
  }
}))

describe('JWT Adapter', () => {
  test('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret_key')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
  })

  test('should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret_key')
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('token')
  })

  test('should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret_key')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
      return new Promise((_resolve, reject) => reject(new Error()))
    })
    const error = sut.encrypt('any_id')
    await expect(error).rejects.toThrow()
  })
})
