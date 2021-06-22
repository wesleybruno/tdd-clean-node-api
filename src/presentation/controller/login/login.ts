import { Authentication } from '../../../domain/usecase/authentication'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers'
import { Validation } from '../../helpers/validators/validation'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
    private readonly validator: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const resultValidation = this.validator.validate(httpRequest.body)
      if (resultValidation) {
        return badRequest(resultValidation)
      }
      const {
        email,
        password
      } = httpRequest.body

      const emailValid = this.emailValidator.isValid(email)
      if (!emailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authentication.auth(email, password)

      if (!token) {
        return unauthorized()
      }

      return ok({ accessToken: token })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
