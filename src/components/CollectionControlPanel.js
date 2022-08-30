import { createCollection, editCollection } from "../http/collectionApi"
import { useContext, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { Form, Button, ButtonGroup } from "react-bootstrap"

const CollectionControlPanel = observer(() => {
  const { user, collection } = useContext(Context)
  const handleClickCreateCollection = async () => {
    collection.setIsLoad(false)
    user.isView ? await createCollection(collection.fields.name, collection.fields.description, collection.fields.theme, JSON.parse(localStorage.getItem('viewUser')).email).finally(() => {
      collection.setIsLoad(true)
      handleClickCancel()
    }) : await createCollection(collection.fields.name, collection.fields.description, collection.fields.theme, user.email).finally(() => {
      collection.setIsLoad(true)
      handleClickCancel()
    })
  }
  const handleClickEditCollection = async () => {
    collection.setIsLoad(false)
    await editCollection(collection.fields.id, collection.fields.name, collection.fields.description, collection.fields.theme).finally(() => {
      collection.setIsLoad(true)
      handleClickCancel()
    })
  }
  const handleClickCancel = () => {
    collection.setFields({ id: "", name: "", description: "", theme: "Книги" })
    collection.setEditMode(false)
  }
  useEffect(() => {
    collection.setFields({ id: "", name: "", description: "", theme: "Книги" })
    user.setIsView(localStorage.getItem('isView'))
  }, [])
  return <Form className="p-3 d-flex" style={{ minWidth: 450, rowGap: 14, flexDirection: "column" }}>
    <h2>Страница управления коллекциями</h2>
    <h4>{collection.editMode ? "Редактирование коллекции" : "Создание коллекции"}</h4>
    <Form.Group>
      <Form.Label>Название коллекции</Form.Label>
      <Form.Control type="text" value={collection.fields.name} onChange={(e) => collection.setFields({ id: collection.fields.id, name: e.target.value, description: collection.fields.description, theme: collection.fields.theme })} placeholder="Введите название коллекции" />
    </Form.Group>
    <Form.Group>
      <Form.Label>Описание коллекции</Form.Label>
      <Form.Control as="textarea" rows={3} value={collection.fields.description} onChange={(e) => collection.setFields({ id: collection.fields.id, name: collection.fields.name, description: e.target.value, theme: collection.fields.theme })} />
    </Form.Group>
    <Form.Group >
      <Form.Label>Тема коллекции</Form.Label>
      <Form.Select value={collection.fields.theme} onChange={(e) => collection.setFields({ id: collection.fields.id, name: collection.fields.name, description: collection.fields.description, theme: e.target.value })} >
        <option>Книги</option>
        <option>Фильмы</option>
        <option>Автомобили</option>
      </Form.Select>
    </Form.Group>
    {collection.editMode ? <ButtonGroup>
      <Button variant="dark" onClick={() => handleClickEditCollection()}>Отредактировать коллекцию</Button>
      <Button variant="secondary" onClick={() => handleClickCancel()}>Отменить</Button>
    </ButtonGroup> : <Button variant="success" onClick={() => handleClickCreateCollection()}>Создать коллекцию</Button>}
  </Form>
})

export default CollectionControlPanel