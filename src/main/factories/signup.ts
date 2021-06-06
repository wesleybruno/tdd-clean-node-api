import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptografy/bcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controller/signup-controller'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorator/log'

export const makeSignUpController = (): Controller => {
  const saltNumber = 12
  const bcryptAdapter = new BcryptAdapter(saltNumber)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  const emailValidatorAdapter = new EmailValidatorAdapter()
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)

  return new LogControllerDecorator(signupController)
}
