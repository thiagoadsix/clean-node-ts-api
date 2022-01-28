import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({
      name: 'name'
    })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return if validation success', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({
      field: 'name'
    })
    expect(error).toBeNull()
  })
})
