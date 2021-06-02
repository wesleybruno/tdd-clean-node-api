import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

describe('Signup Controller', () => {
  test('Should return 400 if no name is provider', () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
})
