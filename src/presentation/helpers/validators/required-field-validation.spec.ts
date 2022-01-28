import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

interface MakeSutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (field: string): MakeSutTypes => {
  const sut = new RequiredFieldValidation(field)
  return {
    sut
  }
}

describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const { sut } = makeSut('field')
    const error = sut.validate({
      name: 'name'
    })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return if validation success', () => {
    const { sut } = makeSut('field')
    const error = sut.validate({
      field: 'name'
    })
    expect(error).toBeNull()
  })
})
