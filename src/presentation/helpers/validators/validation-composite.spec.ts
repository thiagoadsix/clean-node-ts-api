import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

interface MakeSutTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): MakeSutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new MissingParamError('field')
    }
  }

  return new ValidationStub()
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
