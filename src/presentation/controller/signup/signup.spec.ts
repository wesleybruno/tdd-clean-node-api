import { AccountModel } from '../../../domain/entity/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecase/add-account'
import { badRequest, ok, serverError } from '../../helpers'
import { Validation } from '../../protocols/validation'
import { HttpRequest } from '../../protocols'
import { SignUpController } from './signup-controller'

interface SutType {
  sut: SignUpController
  validatorStub: Validation
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

const makeValidator = (): Validation => {
  class ValidatorStub implements Validation {
    validate (input: string): Error {
      return null
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutType => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidator()
  return {
    addAccountStub,
    validatorStub,
    sut: new SignUpController(addAccountStub, validatorStub)
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
  test('Should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const spy = jest.spyOn(validatorStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if Validation return error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
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
