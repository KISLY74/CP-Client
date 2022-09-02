import { Card, ListGroup, Button, Spinner, Badge } from "react-bootstrap"
import { COLLECTION_ROUTE, OWN_PAGE_ROUTE } from "../utils/routes"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { deleteCollection } from "../http/collectionApi"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
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
  const handleClickEditMode = (id) => {
    collection.setEditMode(true)
    collections.find(e => {
      if (e._id === id) {
        collection.setFields({ id: id, name: e.name, description: e.description, theme: e.theme })
      }
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
  const handleClickDeleteCollection = async (id) => {
    await deleteCollection(id)
    checkIsViewAndUpdate()
  }
  useEffect(() => {
    props.isOwn ? localStorage.setItem('isView', false) : localStorage.setItem('isView', true)
    checkIsViewAndUpdate()
  }, [])
  return <div className="p-3">
    <h4>Список коллекций</h4>
    <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
      {loading ? collections.map((e, i) =>
        <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} key={i}>
          <Card.Body style={{ backgroundColor: '#222' }}>
            <Card.Title >
              <h4>
                <Badge bg="success" onClick={() => {
                  localStorage.setItem('collectionStore', JSON.stringify(e))
                  history(COLLECTION_ROUTE)
                  props.isOwn ? localStorage.setItem('isView', false) : localStorage.setItem('isView', true)
                }} style={{ cursor: "pointer" }}>{e.name}</Badge>
              </h4>
            </Card.Title>
          </Card.Body>
          <ListGroup>
            <ListGroup.Item>Описание: {e.description}</ListGroup.Item>
            <ListGroup.Item>Тема: {e.theme}</ListGroup.Item>
            {props.isOwn || user.roles.includes("ADMIN") ?
              <ListGroup.Item className="d-flex justify-content-between">
                <Button onClick={() => handleClickDeleteCollection(e._id)} variant="danger">Удалить</Button>
                <Button variant="secondary" onClick={() => handleClickEditMode(e._id)}>Редактировать</Button>
              </ListGroup.Item> : false}
          </ListGroup>
        </Card>) : <Spinner className="position-absolute top-50 start-50" animation="border" />}
    </div>
  </div>
})

export default ListCollection