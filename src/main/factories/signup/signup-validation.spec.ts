import { CompareFieldValidation } from '../../../presentation/helpers/validators/compare-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  return new EmailValidorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    const emailValidatorAdapter = makeEmailValidator()
    validations.push(new EmailFieldValidation('email', emailValidatorAdapter))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
