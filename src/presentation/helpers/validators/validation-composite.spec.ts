import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStub: ValidationStub[]
}

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

const makeValidationStub = (): ValidationStub => {
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = [
    makeValidationStub(),
    makeValidationStub()
  ]

  const sut = new ValidationComposite(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStub[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
