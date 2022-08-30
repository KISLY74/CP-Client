import { makeAutoObservable } from "mobx"

export default class UserStore {
  constructor() {
    this._isAuth = false
    this._isBlock = false
    this._user = {}
    this._isView = false
    makeAutoObservable(this)
  }
  setIsAuth(bool) {
    this._isAuth = bool
  }
  setIsView(bool) {
    this._isView = bool
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
  get isView() {
    return this._isView
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
  get roles() {
    return this._user.roles
  }
}