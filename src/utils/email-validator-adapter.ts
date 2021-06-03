import { EmailValidator } from '../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: String): boolean {
    return false
  }
}
