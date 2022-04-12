import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

interface MakeSutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (field: string, fieldToCompare: string): MakeSutTypes => {
  const sut = new CompareFieldsValidation(field, fieldToCompare)
  return {
    sut
  }
}

describe('CompareFields Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const { sut } = makeSut('field', 'fieldToCompare')
    const error = sut.validate({
      field: 'value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return if validation success', () => {
    const { sut } = makeSut('field', 'field')
    const error = sut.validate({
      field: 'value',
      fieldToCompare: 'value'
    })
    expect(error).toBeNull()
  })
})
