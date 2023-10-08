const DEFAULT_MASK_CHARACTER = '*'

export interface IMaskFn {
  (input: string, options?: IMaskFnOptions): string
}

export interface IMaskOptions {
  maskFn?: IMaskFn
}

export interface IMaskFnOptions {
  maskChar?: string
}

/**
 * Performs a global, case-insensitive search for string
 * patterns that matches a typical email address and applies a
 * mask over it.
 *
 * The search pattern uses a more straightforward definition
 * of a typical email address, rather than the structure as
 * defined in RFC 5321 and RFC 5322, to keep the matching
 * logic simple.
 */
export const maskAllEmailAddress = (input: string, options?: IMaskOptions): string => {
  const pattern = /[A-Z0-9+_.-]+@[A-Z0-9.-]+/gi
  return input.replace(pattern, match => (options?.maskFn ? options.maskFn(match) : maskEmailAddress(match)))
}

export const maskEmailAddress = (input: string, options?: IMaskFnOptions): string => {
  if (!input.includes('@')) {
    return input
  }
  const [local, domain] = input.split('@')
  return maskRight(local, local.length / 2, options) + '@' + maskLeft(domain, domain.length / 2, options)
}

export const maskLeft = (input: string, n: number, options?: IMaskFnOptions): string => {
  const c = Math.round(n)
  if (c < 0 || c > input.length) {
    return input
  }
  const maskChar = options?.maskChar ?? DEFAULT_MASK_CHARACTER
  return maskChar.repeat(c) + input.slice(c, input.length)
}

export const maskRight = (input: string, n: number, options?: IMaskFnOptions): string => {
  const c = Math.round(n)
  if (c < 0 || c > input.length) {
    return input
  }
  const maskChar = options?.maskChar ?? DEFAULT_MASK_CHARACTER
  return input.slice(0, input.length - c) + maskChar.repeat(c)
}
