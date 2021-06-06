import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogControllerDecorator', () => {
  test('Should call Handle Method', async () => {
    class FakeController implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          statusCode: 200,
          body: {}
        }
        return await Promise.resolve(httpResponse)
      }
    }

    const fakeController = new FakeController()
    const handleSpy = jest.spyOn(fakeController, 'handle')
    const sut = new LogControllerDecorator(fakeController)

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
})
