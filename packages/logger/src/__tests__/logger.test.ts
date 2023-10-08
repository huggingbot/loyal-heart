import { logger } from '..'

const debugLoggerSpy = jest.spyOn(logger, 'debug')

describe('logger', () => {
  it('prints a message', () => {
    logger.debug('hello')
    expect(debugLoggerSpy).toBeCalled()
  })
})
