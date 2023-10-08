import { ApiError } from '../../errors'

export class ReferralServiceException extends ApiError {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}

export class ReferralValidationError extends ReferralServiceException {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}
