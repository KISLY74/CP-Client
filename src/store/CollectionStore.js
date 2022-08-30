import { makeAutoObservable } from "mobx"

export default class CollectionStore {
  constructor() {
    this._collection = {}
    this._biggest = []
    this._additionalFields = []
    this._isLoad = true
    this._editMode = false
    this._fields = {}
    makeAutoObservable(this)
  }
  setCollection(collection) {
    this._collection = collection
  }
  setFields(obj) {
    this._fields = obj
  }
  setIsLoad(bool) {
    this._isLoad = bool
  }
  setEditMode(bool) {
    this._editMode = bool
  }
  setBiggest(collections) {
    this._biggest = collections
  }
  setAdditionalFields(fields) {
    this._additionalFields = fields
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