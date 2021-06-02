import { HttpResponse } from '../protocols/http'

export const badRequest = (body: Error): HttpResponse => ({
  statusCode: 400,
  body: body
})

export const internalServerError = (body: Error): HttpResponse => ({
  statusCode: 500,
  body: body
})