export class TokenRequest {
  public Code: string;
  public State: string;
  public RedirectState: string;

  constructor(code: string, state: string, redirectstate: string) {
    this.Code = code;
    this.State = state;
    this.RedirectState = redirectstate;
  }
}
