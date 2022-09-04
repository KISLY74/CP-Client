import React from 'react'
import { Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { OWN_PAGE_ROUTE } from "../utils/routes"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import CardCollection from "./CardCollection"
import { getCollectionsByUser } from "../http/collectionApi"

const ListCollection = observer((props) => {
  const { user, collection } = useContext(Context)
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const history = useNavigate()
  const updateCollectionsUser = async () => {
    setLoading(false)
    await getCollectionsByUser(user.email).then((data) => setCollections(data)).finally(() => setLoading(true))
  }
  const updateCollectionViewUser = async () => {
    setLoading(false)
    await getCollectionsByUser(JSON.parse(localStorage.getItem('viewUser')).email).then((data) => {
      setCollections(data)
    }).finally(() => {
      setLoading(true)
    })
  }
  const checkIsViewAndUpdate = () => {
    if (props.isOwn) {
      updateCollectionsUser()
    } else {
      if (localStorage.getItem('isView')) {
        updateCollectionViewUser()
      } else {
        history(OWN_PAGE_ROUTE)
        localStorage.setItem('isView', false)
      }
    }
  }
  useEffect(() => {
    props.isOwn ? localStorage.setItem('isView', false) : localStorage.setItem('isView', true)
    checkIsViewAndUpdate()
  }, [])
  return <div className="p-3">
    <h4>Список коллекций</h4>
    {collection.isLoad ?
      <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
        {loading ? collections.map(e =>
          <CardCollection isOwn={props.isOwn} collection={e} />) : <Spinner className="position-absolute top-50 start-50" animation="border" />}
      </div> : <Spinner className="position-absolute top-50 start-50" animation="border" />}
  </div>
})

export default ListCollection