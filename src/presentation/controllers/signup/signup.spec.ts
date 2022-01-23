import { SignUpController } from './signup'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator
} from './signup-protocols'
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: '1',
        name: 'name',
        email: 'email@example.com',
        password: 'password'
      }

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

interface MakeSutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): MakeSutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    // System Under Test -> sut
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if passwordConfirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    // Mocking return of the function
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    // Spying function
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@example.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    // Mocking implementation of the function
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(new Error()))
      })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: '1',
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    })
  })
})
