import { makeAutoObservable } from "mobx"

export default class ItemStore {
  constructor() {
    this._item = {}
    this._lastAdditionItems = []
    makeAutoObservable(this)
  }
  setItem(item) {
    this._item = item
  }
  setLastAdditionItems(items) {
    this._lastAdditionItems = items
  }
  get item() {
    return this._item
  }
  get lastAdditionItems() {
    return this._lastAdditionItems
  }
}