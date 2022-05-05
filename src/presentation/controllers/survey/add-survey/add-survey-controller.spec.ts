import MockDate from 'mockdate'

import {
  AddSurvey,
  badRequest,
  HttpRequest,
  noContent,
  serverError,
  Validation
} from './add-survey-controller-protocols'

import { AddSurveyController } from './add-survey-controller'

import { mockAddSurvey, mockValidation } from '@/presentation/test'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

const mockAddSurveyRequest = (): HttpRequest => ({
  body: {
    question: 'Any question',
    answers: [{
      image: 'any image',
      answer: 'Any answer'
    }],
    date: new Date()
  }
})

describe('Add Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockAddSurveyRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockAddSurveyRequest().body)
  })

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockAddSurveyRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSurveySpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(mockAddSurveyRequest())
    expect(addSurveySpy).toHaveBeenCalledWith(mockAddSurveyRequest().body)
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(serverError(new Error()))))
    const httpResponse = await sut.handle(mockAddSurveyRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockAddSurveyRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
