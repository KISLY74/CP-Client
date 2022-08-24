import { useContext, useEffect, useState } from "react"
import { Form, Button, Card, ListGroup, Spinner } from "react-bootstrap"
import { createCollection, deleteCollection, getCollectionById, getCollectionsByUser } from "../http/collectionApi"
import { Context } from "../index"
import { observer } from "mobx-react-lite"

const User = observer(() => {
  const { user } = useContext(Context)
  const [collectionName, setCollectionName] = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('Книги')
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const handleClickCreateCollection = async () => {
    await createCollection(collectionName, description, theme, user.email)
    updateCollectionsUser()
  }
  const handleClickDeleteCollection = async (id) => {
    await deleteCollection(id)
    updateCollectionsUser()
  }
  const updateCollectionsUser = async () => {
    const data = await getCollectionsByUser(user.email)
    setCollections(data)
  }
  useEffect(() => {
    setLoading(false)
    user.setUser(JSON.parse(localStorage.getItem('userStore')))
    updateCollectionsUser().finally(() => setLoading(true))
  }, [])
  return (
    <div className="d-flex">
      <Form className="p-3 d-flex" style={{ minWidth: 450, rowGap: 14, flexDirection: "column" }}>
        <h4>Создание коллекции</h4>
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
        <Button onClick={() => handleClickCreateCollection()}>Создать коллекцию</Button>
      </Form>
      <div className="p-3">
        <h4>Список коллекций</h4>
        <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
          {loading ?
            collections.map((e, i) =>
              <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} key={i}>
                <Card.Body>
                  <Card.Title>{e.name}</Card.Title>
                </Card.Body>
                <ListGroup>
                  <ListGroup.Item>Описание: {e.description}</ListGroup.Item>
                  <ListGroup.Item>Тема: {e.theme}</ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <Button onClick={() => handleClickDeleteCollection(e._id)} variant="danger">Удалить</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>) : <Spinner className="position-absolute top-50 start-50" animation="border" />}
        </div>
      </div >
    </div >
  )
})

export default User