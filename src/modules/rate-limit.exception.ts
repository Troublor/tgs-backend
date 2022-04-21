export default class RateLimitException extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}
