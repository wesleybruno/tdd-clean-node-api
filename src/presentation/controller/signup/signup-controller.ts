import { AddAccount } from '../../../domain/usecase/add-account'
import { badRequest, serverError, ok } from '../../helpers'
import { Validation } from '../../helpers/validators/validation'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const resultValidation = this.validator.validate(httpRequest.body)
      if (resultValidation) {
        return badRequest(resultValidation)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
