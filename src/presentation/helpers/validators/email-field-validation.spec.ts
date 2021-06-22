import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { EmailFieldValidation } from './email-field-validation'

interface SutType {
  sut: EmailFieldValidation
  emailValidatorStub: EmailValidator
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
  return {
    emailValidatorStub,
    sut: new EmailFieldValidation('email', emailValidatorStub)
  }
}

describe('EmailFieldValidation', () => {
  test('Should call EmailValidator with invalid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with valid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('email@mail.com')
  })

  // test('Should return throws if emailValidator throws', () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
  //     throw new Error()
  //   })

  //   const result = sut.validate({ email: 'email@mail.com' })
  //   expect(result).toEqual(new Error())
  // })
})
