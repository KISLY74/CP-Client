import { makeAutoObservable } from "mobx"

export default class CollectionStore {
  constructor() {
    this._collection = {}
    makeAutoObservable(this)
  }
  setCollection(collection) {
    this._collection = collection
  }
  get collection() {
    return this._collection
  }
  get collectionName() {
    return this._collection.name
  }
  get id() {
    return this._collection._id
  }
}