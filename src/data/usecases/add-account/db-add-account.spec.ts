import { DbAddAccount } from './db-add-account'
import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository
} from './db-add-account-protocols'

interface MakeSutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): MakeSutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    encrypterStub,
    sut,
    addAccountRepositoryStub
  }
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise<AccountModel>((resolve) => resolve({
        id: '1',
        name: 'name',
        email: 'email@example.com',
        password: 'hashed_password'
      }))
    }
  }

  return new AddAccountRepositoryStub()
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

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    // Dependency is returning a exception
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }

    // Remove the await here
    const promise = sut.add(accountData)
    // To catch the error here
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }
    await sut.add(accountData)
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@example.com',
      password: 'hashed_password'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'hashed_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: '1',
      name: 'name',
      email: 'email@example.com',
      password: 'hashed_password'
    })
  })
})
