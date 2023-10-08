import { ApiError } from '../../errors'

export class RewardServiceException extends ApiError {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}

export class RewardValidationError extends RewardServiceException {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}
