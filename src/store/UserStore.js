import { makeAutoObservable } from "mobx"

export default class UserStore {
  constructor() {
    this._isAuth = false
    this._isBlock = false
    this._user = {}
    makeAutoObservable(this)
  }
  setIsAuth(bool) {
    this._isAuth = bool
  }
  setUser(user) {
    this._user = user
  }
  setIsBlock(bool) {
    this._isBlock = bool
  }
  get isAuth() {
    return this._isAuth
  }
  get user() {
    return this._user
  }
  get isBlock() {
    return this._isBlock
  }
  get email() {
    return this._user.email
  }
  get username() {
    return this._user.username
  }
  get roles() {
    return this._user.roles
  }
}