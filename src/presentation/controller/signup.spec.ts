import { AccountModel } from '../../domain/entity/account'
import { AddAccount, AddAccountModel } from '../../domain/usecase/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup-controller'

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: '',
        name: '',
        password: '',
        email: ''
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }

  return new EmailValidorStub()
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  return {
    emailValidatorStub: emailValidatorStub,
    addAccountStub: addAccountStub,
    sut: new SignUpController(emailValidatorStub, addAccountStub)
  }
}
describe('Signup Controller', () => {
  test('Should return 400 if no name is provider', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@teste.com.br',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provider', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@teste.com.br',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provider', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@teste.com.br',
        password: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'asd',
        passwordConfirmation: 'asd123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should call email is valid', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@mail.com')
  })

  test('Should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAcount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountStubSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    sut.handle(httpRequest)

    expect(addAccountStubSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@mail.com',
      password: 'asd'
    })
  })

  test('Should return 500 if AddAcount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
