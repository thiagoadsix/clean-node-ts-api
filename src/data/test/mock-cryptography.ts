import { Hasher } from '@/data/protocols/cryptography/hasher'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'

const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise<string>((resolve) => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return new Promise<string>((resolve) => resolve('any value'))
    }
  }

  return new DecrypterStub()
}

const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise<string>((resolve) => resolve('token'))
    }
  }

  return new EncrypterStub()
}

const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise<boolean>((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

export { mockHasher, mockDecrypter, mockEncrypter, mockHashComparer }
