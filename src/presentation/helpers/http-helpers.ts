import { HttpResponse } from '../protocols'

export const badRequest = (body: Error): HttpResponse => ({
  statusCode: 400,
  body: body
})

export const internalServerError = (body: Error): HttpResponse => ({
  statusCode: 500,
  body: body
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body: body
})
