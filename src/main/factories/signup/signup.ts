
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptografy/bcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorator/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const saltNumber = 12
  const bcryptAdapter = new BcryptAdapter(saltNumber)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  const validationComposite = makeSignUpValidation()
  const signupController = new SignUpController(dbAddAccount, validationComposite)

  const logErrorRepository = new LogMongoRepository()

  return new LogControllerDecorator(signupController, logErrorRepository)
}
