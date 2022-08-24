import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { Form, Spinner, Button, ButtonGroup, Card, ListGroup } from "react-bootstrap"
import { createItem, deleteItem, getItemsByCollection, editItem } from "../http/itemApi"
import { changeItemsInCollection } from "../http/collectionApi"

const Collection = observer(() => {
  const { collection } = useContext(Context)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataForm, setDataForm] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [idItem, setIdItem] = useState()
  const updateItemsCollection = async () => {
    setLoading(false)
    await getItemsByCollection(collection.id).then(async (data) => {
      await changeItemsInCollection(collection.id, data.map(e => e._id))
      setItems(data)
    }).finally(() => setLoading(true))
  }
  const handleClickCreateItem = async () => {
    await createItem(dataForm.name, dataForm.tags.split(','), collection.id)
    updateItemsCollection()
    setDataForm({ name: "", tags: "" })
  }
  const handleClickDeleteItem = async (id) => {
    await deleteItem(id)
    updateItemsCollection()
  }
  const handleClickEditItem = async () => {
    await editItem(idItem, dataForm.name, dataForm.tags).finally(() => handleClickCancel())
    updateItemsCollection()
  }
  const handleClickCancel = async () => {
    setEditMode(false)
    setDataForm({ name: "", tags: "" })
  }
  const handleClickEditMode = async (id) => {
    setEditMode(true)
    setIdItem(id)
    items.find(e => {
      if (e._id === id) {
        setDataForm({ name: e.name, tags: e.tags })
      }
    })
  }
  useEffect(() => {
    collection.setCollection(JSON.parse(localStorage.getItem('collectionStore')))
    updateItemsCollection()
  }, [])
  return (
    <div className="d-flex">
      <Form className="p-3 d-flex" style={{ minWidth: 450, rowGap: 14, flexDirection: "column" }}>
        <h4>{editMode ? "Редактирование элемента" : "Создание элемента"}</h4>
        <Form.Group>
          <Form.Label>Название коллекции</Form.Label>
          <Form.Control type="text" value={dataForm.name} onChange={(e) => setDataForm({ name: e.target.value, tags: dataForm.tags })} placeholder="Введите название коллекции" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Теги</Form.Label>
          <Form.Control as="textarea" rows={3} value={dataForm.tags} onChange={(e) => setDataForm({ name: dataForm.name, tags: e.target.value })} />
        </Form.Group>
        {editMode ? <ButtonGroup>
          <Button variant="dark" onClick={() => handleClickEditItem()}>Отредактировать элемент</Button>
          <Button variant="secondary" onClick={() => handleClickCancel()}>Отменить</Button>
        </ButtonGroup> : <Button variant="success" onClick={() => handleClickCreateItem()}>Создать элемент</Button>}
      </Form>
      <div className="p-3">
        <h4>Список элементов</h4>
        <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
          {loading ?
            items.map((e, i) =>
              <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} key={i}>
                <Card.Body>
                  <Card.Title>
                    {e.name}
                  </Card.Title>
                </Card.Body>
                <ListGroup>
                  <ListGroup.Item>Теги: {e.tags.toString()}</ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <Button onClick={() => handleClickDeleteItem(e._id)} variant="danger">Удалить</Button>
                    <Button variant="dark" onClick={() => { handleClickEditMode(e._id) }}>Редактировать</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>) : <Spinner className="position-absolute top-50 start-50" animation="border" />}
        </div>
      </div >
    </div >
  )
})

export default Collection