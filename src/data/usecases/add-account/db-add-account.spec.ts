import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface MakeSutTypes {
  encrypterStub: Encrypter
  sut: DbAddAccount
}

const makeSut = (): MakeSutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    encrypterStub,
    sut
  }
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise<string>((resolve) => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('password')
  })
})