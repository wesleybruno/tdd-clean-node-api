import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { badRequest, internalServerError } from '../helpers'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from '../protocols'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const emailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailValid) { return badRequest(new InvalidParamError('email')) }

      return {
        statusCode: 200,
        body: true
      }
    } catch (error) {
      return internalServerError(new ServerError())
    }
  }
}
