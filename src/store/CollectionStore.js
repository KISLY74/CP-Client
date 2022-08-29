import { makeAutoObservable } from "mobx"

export default class CollectionStore {
  constructor() {
    this._collection = {}
    this._biggest = []
    this._additionalFields = []
    makeAutoObservable(this)
  }
  setCollection(collection) {
    this._collection = collection
  }
  setBiggest(collections) {
    this._biggest = collections
  }
  setAdditionalFields(fields) {
    this._additionalFields = fields
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
  get biggest() {
    return this._biggest
  }
  get additionalFields() {
    return this._additionalFields
  }
}