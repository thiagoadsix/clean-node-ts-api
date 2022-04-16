
import { Validation } from '../../../../../presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { makeAddSurveyValidationFactory } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurvey Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidationFactory()
    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
