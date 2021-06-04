import { AccountModel } from '../../../domain/entity/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecase/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve({
      ...account,
      id: ''
    }))
  }
}
