import { makeAutoObservable } from "mobx"

export default class ItemStore {
  constructor() {
    this._item = {}
    this._isLoad = true
    this._editMode = false
    this._fields = {}
    this._lastAdditionItems = []
    this._commentsLoad = false
    makeAutoObservable(this)
  }
  setItem(item) {
    this._item = item
  }
  setIsLoad(bool) {
    this._isLoad = bool
  }
  setCommentsLoad(bool) {
    this._commentsLoad = bool
  }
  setEditMode(bool) {
    this._editMode = bool
  }
  setFields(obj) {
    this._fields = obj
  }
  setLastAdditionItems(items) {
    this._lastAdditionItems = items
  }
  get item() {
    return this._item
  }
  get commentsLoad() {
    return this._commentsLoad
  }
  get isLoad() {
    return this._isLoad
  }
  get editMode() {
    return this._editMode
  }
  get fields() {
    return this._fields
  }
  get fieldsName() {
    return this._fields.name
  }
  get lastAdditionItems() {
    return this._lastAdditionItems
  }
  get name() {
    return this._item.name
  }
  get id() {
    return this._item._id
  }
}