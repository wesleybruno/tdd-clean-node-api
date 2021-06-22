import { LoginController } from './login'
import { badRequest, ok, serverError, unauthorized } from '../../helpers'
import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { Authentication } from '../../../domain/usecase/authentication'
import { Validation } from '../../helpers/validators/validation'

const makeValidator = (): Validation => {
  class ValidatorStub implements Validation {
    validate (email: string): Error {
      return null
    }
  }

  return new ValidatorStub()
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
  authenticationStub: Authentication
  validatorStub: Validation
  sut: LoginController
}

const makeSut = (): SutType => {
  const authenticationStub = makeAuthentication()
  const validatorStub = makeValidator()
  return {
    authenticationStub,
    validatorStub,
    sut: new LoginController(authenticationStub, validatorStub)
  }
}

describe('Login Controller', () => {
  test('Should return 500 if authenticator throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
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
    expect(result).toEqual(ok({ accessToken: 'any-token' }))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const spy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(spy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const spy = jest.spyOn(validatorStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith(request.body)
  })

  test('Should return status 400 if validation return error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(
      new MissingParamError('any_field')
    )
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
