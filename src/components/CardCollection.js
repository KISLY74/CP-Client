import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, Badge, Button, ListGroup } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { COLLECTION_ROUTE, OWN_PAGE_ROUTE, USER_ROUTE, MAIN_ROUTE } from "../utils/routes"
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import { getCollectionsByUser, deleteCollection } from "../http/collectionApi"
import { getUsers, getUserByCollection } from '../http/userApi'

const CardCollection = observer((props) => {
  const { user, collection } = useContext(Context)
  const history = useNavigate()
  const location = useLocation()
  const [collections, setCollections] = useState([])
  const [users, setUsers] = useState([])
  const getStateUsers = async () => {
    await getUsers().then((res) => setUsers(res.data))
  }
  const updateCollectionViewUser = async () => {
    await getCollectionsByUser(JSON.parse(localStorage.getItem('viewUser')).email).then((data) => {
      setCollections(data)
    })
  }
  const updateCollectionsUser = async () => {
    await getCollectionsByUser(user.email).then((data) => setCollections(data))
  }
  const checkIsViewAndUpdate = () => {
    if (props.isOwn) {
      updateCollectionsUser()
    } else {
      if (localStorage.getItem('isView') === "true") {
        updateCollectionViewUser()
      } else {
        localStorage.setItem('isView', false)
        if (!user.isAuth) history(MAIN_ROUTE)
      }
    }
  }
  const handleClickDeleteCollection = async (id) => {
    collection.setIsLoad(false)
    await deleteCollection(id).finally(() => collection.setIsLoad(true))
  }
  const groupDeleteEdit = () => {
    return <ListGroup.Item className="d-flex justify-content-between">
      <Button onClick={() => handleClickDeleteCollection(props.collection._id)} variant="danger">Удалить</Button>
      <Button variant="secondary" onClick={() => handleClickEditMode(props.collection._id)}>Редактировать</Button>
    </ListGroup.Item>
  }
  const handleClickEditMode = (id) => {
    collection.setEditMode(true)
    collections.find(e => {
      if (e._id === id) {
        collection.setFields({ id: id, name: e.name, description: e.description, theme: e.theme })
      }
    })
  }
  const handleClickNormalUser = async (id) => {
    await getUserByCollection(id).then((data) => {
      localStorage.setItem('isView', true)
      localStorage.setItem('viewUser', JSON.stringify(data))
      history(USER_ROUTE)
    })
  }
  useEffect(() => {
    getStateUsers()
    checkIsViewAndUpdate()
  }, [])
  return <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} key={props.collection}>
    <Card.Body className="rounded-top" style={{ backgroundColor: '#222', maxHeight: 350 }}>
      {users.map(user => {
        if (user.collections.includes(props.collection._id))
          return <h5>
            <Badge className="position-absolute top-0 end-0" bg="secondary" style={{ cursor: "pointer" }} onClick={() => handleClickNormalUser(props.collection._id)}> {user.username}</Badge>
          </h5>
      })}
      <Card.Title >
        <h4>
          {!props.isMain ?
            <Badge bg="success" onClick={() => {
              localStorage.setItem('collectionStore', JSON.stringify(props.collection))
              props.isOwn ? localStorage.setItem('isView', false) : localStorage.setItem('isView', true)
              history(COLLECTION_ROUTE)
            }} style={{ cursor: "pointer" }}>{props.collection.name}</Badge>
            : <Badge bg="success">{props.collection.name}</Badge>}
        </h4>
      </Card.Title>
    </Card.Body>
    <ListGroup>
      <ListGroup.Item>Описание: <ReactMarkdown>{props.collection.description}</ReactMarkdown></ListGroup.Item>
      <ListGroup.Item>Тема: {props.collection.theme}</ListGroup.Item>
      {!props.isMain ? props.isOwn ? groupDeleteEdit() : !user.isAuth ? false : user.roles.includes("ADMIN") ? groupDeleteEdit() : false : false}
    </ListGroup>
  </Card>
})
export default CardCollection