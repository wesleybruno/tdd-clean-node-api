import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup-controller'

const makeSut = (): SignUpController => {
  return new SignUpController()
}
describe('Signup Controller', () => {
  test('Should return 400 if no name is provider', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provider', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provider', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'any_email',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provider', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'any_email',
        password: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
