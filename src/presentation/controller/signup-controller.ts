import { AddAccount } from '../../domain/usecase/add-account'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { badRequest, internalServerError, ok } from '../helpers'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from '../protocols'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const emailValid = this.emailValidator.isValid(email)
      if (!emailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return internalServerError(new ServerError())
    }
  }
}
