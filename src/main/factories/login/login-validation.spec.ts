import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  return new EmailValidorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    const emailValidatorAdapter = makeEmailValidator()
    validations.push(new EmailFieldValidation('email', emailValidatorAdapter))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
