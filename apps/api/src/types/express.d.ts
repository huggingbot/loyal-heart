import { IContext } from '.'

// /**
//  * Extension of express request typing
//  */
declare module 'express-serve-static-core' {
  interface Request {
    context: IContext
  }
}
