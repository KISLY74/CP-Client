import { createCollection, editCollection, getCollections } from "../http/collectionApi"
import { useContext, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { Form, Button, ButtonGroup } from "react-bootstrap"

const CollectionControlPanel = observer((props) => {
  const { user, collection } = useContext(Context)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('Книги')
  const getCollectionsAndSetToStore = async () => {
    await getCollections().then((data) => {
      collection.setBiggest(data.sort((a, b) => b.items.length - a.items.length).slice(0, 5))
    })
  }
  const handleClickCreateCollection = async () => {
    collection.setIsLoad(false)
    !props.isOwn ? await createCollection(name, description, theme, JSON.parse(localStorage.getItem('viewUser')).email).finally(() => {
      collection.setIsLoad(true)
      getCollectionsAndSetToStore()
      handleClickCancel()
    }) : await createCollection(name, description, theme, user.email).finally(() => {
      collection.setIsLoad(true)
      getCollectionsAndSetToStore()
      handleClickCancel()
    })
  }
  const handleClickEditCollection = async () => {
    collection.setIsLoad(false)
    await editCollection(collection.fields.id, name, description, theme).finally(() => {
      collection.setIsLoad(true)
      getCollectionsAndSetToStore()
      handleClickCancel()
    })
  }
  const handleClickCancel = () => {
    collection.setFields({ id: "", name: "", description: "", theme: "Книги" })
    collection.setEditMode(false)
  }
  useEffect(() => {
    if (collection.editMode) {
      setName(collection.fields.name)
      setDescription(collection.fields.description)
      setTheme(collection.fields.theme)
    }
  }, [])
  return <Form className="p-3 d-flex" style={{ minWidth: 450, rowGap: 14, flexDirection: "column" }}>
    <h2>Страница управления коллекциями</h2>
    <h4>{collection.editMode ? "Редактирование коллекции" : "Создание коллекции"}</h4>
    <Form.Group>
      <Form.Label>Название коллекции</Form.Label>
      <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите название коллекции" />
    </Form.Group>
    <Form.Group>
      <Form.Label>Описание коллекции</Form.Label>
      <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
    </Form.Group>
    <Form.Group >
      <Form.Label>Тема коллекции</Form.Label>
      <Form.Select value={theme} onChange={(e) => setTheme(e.target.value)} >
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