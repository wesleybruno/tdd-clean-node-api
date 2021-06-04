import { AddAccountModel } from './../../domain/usecase/add-account'
import { AccountModel } from './../../domain/entity/account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
