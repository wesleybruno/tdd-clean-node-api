import { ValidationComposite, RequiredFieldValidation, EmailFieldValidation, CompareFieldValidation } from '../../../presentation/helpers/validators/'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))

  const emailValidatorAdapter = new EmailValidatorAdapter()
  validations.push(new EmailFieldValidation('email', emailValidatorAdapter))

  return new ValidationComposite(validations)
}
