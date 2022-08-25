import { useContext, useEffect, useState } from "react"
import { Form, Button, Card, ListGroup, Spinner, ButtonGroup } from "react-bootstrap"
import { createCollection, deleteCollection, editCollection, getCollectionsByUser } from "../http/collectionApi"
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { COLLECTION_ROUTE, LOGIN_ROUTE } from "../utils/routes"
import { NavLink, useNavigate } from "react-router-dom"

const User = observer(() => {
  const { user, collection } = useContext(Context)
  const history = useNavigate()
  const [collectionName, setCollectionName] = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('Книги')
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [idCollection, setIdCollection] = useState()
  const handleClickCreateCollection = async () => {
    await createCollection(collectionName, description, theme, user.email).finally(() => handleClickCancel())
    updateCollectionsUser()
  }
  const handleClickDeleteCollection = async (id) => {
    await deleteCollection(id)
    updateCollectionsUser()
  }
  const handleClickEditCollection = async () => {
    await editCollection(idCollection, collectionName, description, theme).finally(() => handleClickCancel())
    updateCollectionsUser()
  }
  const handleClickEditMode = (id) => {
    setEditMode(true)
    setIdCollection(id)
    collections.find(e => {
      if (e._id === id) {
        setCollectionName(e.name)
        setDescription(e.description)
        setTheme(e.theme)
      }
    })
  }
  const handleClickCancel = () => {
    setEditMode(false)
    setCollectionName("")
    setDescription("")
    setTheme("Книги")
  }
  const updateCollectionsUser = async () => {
    setLoading(false)
    const data = await getCollectionsByUser(user.email).finally(() => setLoading(true))
    setCollections(data)
  }
  useEffect(() => {
    updateCollectionsUser()
  }, [])
  return (
    <div>
      {
        user.isAuth ?
          <div className="d-flex">
            <Form className="p-3 d-flex" style={{ minWidth: 450, rowGap: 14, flexDirection: "column" }}>
              <h2>Страница управления коллекциями</h2>
              <h4>{editMode ? "Редактирование коллекции" : "Создание коллекции"}</h4>
              <Form.Group>
                <Form.Label>Название коллекции</Form.Label>
                <Form.Control type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder="Введите название коллекции" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Описание коллекции</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Form.Group>
              <Form.Group >
                <Form.Label>Тема коллекции</Form.Label>
                <Form.Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option>Книги</option>
                  <option>Фильмы</option>
                  <option>Автомобили</option>
                </Form.Select>
              </Form.Group>
              {editMode ? <ButtonGroup>
                <Button variant="dark" onClick={() => handleClickEditCollection()}>Отредактировать коллекцию</Button>
                <Button variant="secondary" onClick={() => handleClickCancel()}>Отменить</Button>
              </ButtonGroup> : <Button onClick={() => handleClickCreateCollection()}>Создать коллекцию</Button>}
            </Form>
            <div className="p-3">
              <h4>Список коллекций</h4>
              <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
                {loading ?
                  collections.map((e, i) =>
                    <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} key={i}>
                      <Card.Body>
                        <Card.Title>
                          <NavLink className="text-decoration-none" onClick={() => localStorage.setItem('collectionStore', JSON.stringify(e))} to={COLLECTION_ROUTE}>Страница коллекции{'>>>'}</NavLink>
                          {e.name}
                        </Card.Title>
                      </Card.Body>
                      <ListGroup>
                        <ListGroup.Item>Описание: {e.description}</ListGroup.Item>
                        <ListGroup.Item>Тема: {e.theme}</ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <Button onClick={() => handleClickDeleteCollection(e._id)} variant="danger">Удалить</Button>
                          <Button variant="dark" onClick={() => { handleClickEditMode(e._id) }}>Редактировать</Button>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>) : <Spinner className="position-absolute top-50 start-50" animation="border" />}
              </div>
            </div >
          </div > : history(LOGIN_ROUTE)
      }
    </div>
  )
})

export default User