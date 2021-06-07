import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const makefakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeEncripter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  const encrypterStub = new EncrypterStub()
  return encrypterStub
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makefakeAccount())
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncripter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call encripter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if throw', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    encryptSpy.mockReturnValueOnce(
      Promise.reject(new Error())
    )

    const account = sut.add(makeAccountData())
    await expect(account).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const encryptSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if throw', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const encryptSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    encryptSpy.mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makefakeAccount())
  })
})
