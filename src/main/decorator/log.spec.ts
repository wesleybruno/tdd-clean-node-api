import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/entity/account'
import { ok, serverError } from '../../presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutType {
  fakeController: Controller
  sut: LogControllerDecorator
  logErrorRepository: LogErrorRepository
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class FakeController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(makeFakeAccount()))
    }
  }

  return new FakeController()
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeSut = (): SutType => {
  const fakeController = makeController()
  const logErrorRepository = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(fakeController, logErrorRepository)

  return {
    fakeController,
    logErrorRepository,
    sut
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: '',
    name: 'name',
    email: 'email@email.com',
    password: 'asd'
  }
}
)

const makeFakeAccount = (): AccountModel => ({
  id: '',
  name: 'name',
  email: 'email@email.com',
  password: 'asd'
}
)
describe('LogControllerDecorator', () => {
  test('Should call Handle Method', async () => {
    const { sut, fakeController } = makeSut()
    const handleSpy = jest.spyOn(fakeController, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return same result of controller', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeFakeRequest())
    expect(httpReponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, fakeController, logErrorRepository } = makeSut()
    const serverError = mockServerError()

    const logSpy = jest.spyOn(logErrorRepository, 'logError')
    jest.spyOn(fakeController, 'handle').mockReturnValueOnce(Promise.resolve(serverError))

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
