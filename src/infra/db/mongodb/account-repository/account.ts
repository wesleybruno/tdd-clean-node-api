import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/entity/account'
import { AddAccountModel } from '../../../../domain/usecase/add-account'
import { MongoHelper } from './../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const result = await collection.insertOne(account)
    const accountDb = result.ops[0]

    const { _id: id, ...accountWithoutId } = accountDb
    return {
      id,
      ...accountWithoutId
    }
  }
}
