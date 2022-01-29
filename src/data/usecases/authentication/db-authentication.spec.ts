import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'

interface MakeSutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): MakeSutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | null> {
      return await new Promise<AccountModel | null>((resolve) => resolve(makeFakeResponse()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise<boolean>((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise<string>((resolve) => resolve('token'))
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise<void>((resolve) => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeResponse = (): AccountModel => ({
  id: '1',
  name: 'name',
  email: 'email@example.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): AuthenticationModel => ({
  email: 'email@example.com',
  password: 'password'
})

describe('DbAuthentication Usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('email@example.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const error = sut.auth(makeFakeRequest())
    await expect(error).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const accessToken = await sut.auth(makeFakeRequest())
    expect(accessToken).toBeNull()
  })

  test('should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeRequest())
    expect(compareSpy).toHaveBeenCalledWith('password', 'hashed_password')
  })

  test('should throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const error = sut.auth(makeFakeRequest())
    await expect(error).rejects.toThrow()
  })

  test('should return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const accessToken = await sut.auth(makeFakeRequest())
    expect(accessToken).toBeNull()
  })

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeRequest())
    expect(generateSpy).toHaveBeenCalledWith('1')
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const error = sut.auth(makeFakeRequest())
    await expect(error).rejects.toThrow()
  })

  test('should return respective token from TokenGenerator', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeRequest())
    expect(accessToken).toBe('token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith('1', 'token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const error = sut.auth(makeFakeRequest())
    await expect(error).rejects.toThrow()
  })
})
