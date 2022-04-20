import { Validation } from '@/presentation/protocols'

import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

export const makeAddSurveyValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
