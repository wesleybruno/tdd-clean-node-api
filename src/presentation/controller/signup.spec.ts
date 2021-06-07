import { AccountModel } from '../../domain/entity/account'
import { AddAccount, AddAccountModel } from '../../domain/usecase/add-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, ok, serverError } from '../helpers'
import { HttpRequest } from '../protocols'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup-controller'

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'name',
    email: 'email@email.com',
    password: 'asd'
  }
)

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
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

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'name',
    email: 'email@mail.com',
    password: 'asd',
    passwordConfirmation: 'asd'
  }
})
describe('Signup Controller', () => {
  test('Should return 400 if no name is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@teste.com.br',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'asd',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@teste.com.br',
        passwordConfirmation: 'asd'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@teste.com.br',
        password: 'asd'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'asd',
        passwordConfirmation: 'asd123'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should call email is valid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('email@mail.com')
  })

  test('Should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call AddAcount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountStubSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addAccountStubSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@mail.com',
      password: 'asd'
    })
  })

  test('Should return 500 if AddAcount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid data', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
