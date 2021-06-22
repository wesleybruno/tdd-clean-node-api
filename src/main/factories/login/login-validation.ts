import { ValidationComposite, RequiredFieldValidation, EmailFieldValidation } from '../../../presentation/helpers/validators/'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  const emailValidatorAdapter = new EmailValidatorAdapter()
  validations.push(new EmailFieldValidation('email', emailValidatorAdapter))

  return new ValidationComposite(validations)
}
