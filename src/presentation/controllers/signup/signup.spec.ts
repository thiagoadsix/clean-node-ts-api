import { SignUpController } from './signup'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation
} from './signup-protocols'
import { ServerError } from '../../errors'
import {
  ok,
  badRequest,
  serverError
} from '../../helpers'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccountResponse()))
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAccountRequest = (): HttpRequest => ({
  body: {
    name: 'name',
    email: 'email@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

const makeFakeAccountResponse = (): AccountModel => ({
  id: '1',
  name: 'name',
  email: 'email@example.com',
  password: 'password'
})

interface MakeSutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): MakeSutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeAccountRequest()
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

    const httpRequest = makeFakeAccountRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeAccountRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccountResponse()))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeAccountRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeAccountRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
