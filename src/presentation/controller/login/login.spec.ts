import { LoginController } from './login'
import { badRequest } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutType {
  emailValidatorStub: EmailValidator
  sut: LoginController
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  return {
    emailValidatorStub,
    sut: new LoginController(emailValidatorStub)
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
})
