import { LogErrorRepository } from '../../data/protocols/log-error-repository'
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
      return await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class FakeController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {}
      }
      return await Promise.resolve(httpResponse)
    }
  }

  return new FakeController()
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
describe('LogControllerDecorator', () => {
  test('Should call Handle Method', async () => {
    const { sut, fakeController } = makeSut()
    const handleSpy = jest.spyOn(fakeController, 'handle')

    const body = {
      email: 'email@email.com',
      name: 'any_name',
      password: '123',
      passwordConfirmation: '123'
    }
    const httpRequest = {
      body
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return same result of controller', async () => {
    const { sut } = makeSut()
    const body = {
      email: 'email@email.com',
      name: 'any_name',
      password: '123',
      passwordConfirmation: '123'
    }
    const httpRequest = {
      body
    }
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual({
      statusCode: 200,
      body: {}
    })
  })
})
