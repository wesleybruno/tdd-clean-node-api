import { LoginController } from './login'
import { badRequest } from '../../helpers'
import { MissingParamError } from '../../errors'
interface SutType {
  sut: LoginController
}

const makeSut = (): SutType => {
  return {

    sut: new LoginController()
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provider', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: ''
      }
    }
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provider', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@mail.com'
      }
    }
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })
})
