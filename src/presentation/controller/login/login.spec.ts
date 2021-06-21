import { LoginController } from './login'
import { badRequest, ok, serverError, unauthorized } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator, HttpRequest } from '../../protocols'
import { Authentication } from '../../../domain/usecase/authentication'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }
  }

  return httpRequest
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any-token'))
    }
  }

  return new AuthenticationStub()
}

interface SutType {
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
  sut: LoginController
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  return {
    authenticationStub,
    emailValidatorStub,
    sut: new LoginController(emailValidatorStub, authenticationStub)
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

  test('Should return 400 if email is no valid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_pass'
      }
    }
    const result = await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('invalid_email')
    expect(result).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const spy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(spy).toHaveBeenCalledWith('valid_email@mail.com', 'valid_pass')
  })

  test('Should return status 401 if invalid credentials', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(unauthorized())
  })

  test('Should return status 200 if valid credentials', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(ok('any-token'))
  })
})
