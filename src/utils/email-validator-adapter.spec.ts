import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('Eamil Validator Adapter', () => {
  test('Should return false if validator return false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator return false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const isValid = sut.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('Should call with correct value', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
