import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { NavLink } from "react-router-dom"
import { Form, Spinner, Button, ButtonGroup, Table } from "react-bootstrap"
import { createItem, deleteItem, getItemsByCollection, editItem } from "../http/itemApi"
import { addAdditionalFields, getAdditionalFields, changeItemsInCollection } from "../http/collectionApi"
import { ITEM_ROUTE } from "../utils/routes"

const Collection = observer(() => {
  const { collection, item } = useContext(Context)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataForm, setDataForm] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [idItem, setIdItem] = useState()
  const [isShow, setIsShow] = useState(false)
  const [showFields, setShowFields] = useState(false)
  let names = [document.querySelectorAll(".names-strings"), document.querySelectorAll(".names-numbers"), document.querySelectorAll(".names-booleans"), document.querySelectorAll(".names-dates")]
  let fields = [document.querySelectorAll(".strings"), document.querySelectorAll(".numbers"), document.querySelectorAll(".booleans"), document.querySelectorAll(".dates")]
  const updateItemsCollection = async () => {
    setLoading(false)
    await getItemsByCollection(collection.id).then(async (data) => {
      setItems(data)
    }).finally(() => setLoading(true))
  }
  const getAddtitonalFieldsByForm = () => {
    let additionalFields = [{}, {}, {}, {}]
    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < fields[i].length; j++) {
        if (i === 2) {
          additionalFields[i][names[i][j].textContent] = fields[i][j].childNodes[0].checked
        } else {
          if (fields[i][j].value === '') alert("Запоните пустые поля")
          additionalFields[i][names[i][j].textContent] = fields[i][j].value
        }
      }
    }
    return additionalFields
  }
  const clearFormCollection = () => {
    setDataForm({ name: "", tags: "" })
    for (let i = 0; i < fields.length; i++) {
      for (let j = 0; j < fields[i].length; i++) {
        fields[i][j].value = ""
      }
    }
  }
  const handleClickCreateItem = async (e) => {
    await createItem(dataForm.name, dataForm.tags.split(','), collection.id, getAddtitonalFieldsByForm())
    updateItemsCollection()
    handleClickHideFields()
    clearFormCollection()
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
  const handleClickShowFields = () => {
    setIsShow(true)
  }
  const handleClickHideFields = () => {
    setIsShow(false)
  }
  const updateAdditionalFields = async () => {
    await getAdditionalFields(collection.id).then((data) => {
      collection.setAdditionalFields([data.stringsFields, data.numbersFields, data.booleansFields, data.datesFields])
    }).finally(() => setShowFields(true))
  }
  const handleClickAddFields = async () => {
    let controls = document.querySelectorAll(".controls")
    let names = []
    controls.forEach(e => names.push(e.value))
    await addAdditionalFields(collection.id, names[0], names[1], names[2], names[3]).finally(() => {
      updateAdditionalFields()
    })
  }
  useEffect(() => {
    updateItemsCollection()
    collection.setCollection(JSON.parse(localStorage.getItem('collectionStore')))
    updateAdditionalFields()
  }, [])
  return (
    <div>
      <Form className="p-3 d-flex" style={{ maxWidth: 850, rowGap: 14, flexDirection: "column" }}>
        <h2>Коллекция: {collection.collectionName}</h2>
        <h4>{editMode ? "Редактирование элемента" : "Создание элемента"}</h4>
        <Form.Group>
          <Form.Label>Название</Form.Label>
          <Form.Control type="text" value={dataForm.name} onChange={(e) => setDataForm({ name: e.target.value, tags: dataForm.tags })} placeholder="Введите название элемента" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Теги</Form.Label>
          <Form.Control as="textarea" rows={3} value={dataForm.tags} placeholder="Введите теги через запятую" onChange={(e) => setDataForm({ name: dataForm.name, tags: e.target.value })} />
        </Form.Group>
        {showFields ? collection.additionalFields[0] ? collection.additionalFields[0].map((e, i) => {
          if (e) {
            return <Form.Group key={e}>
              <Form.Label className="names-strings">{e}</Form.Label>
              <Form.Control type="text" className="strings" placeholder={`Введите поле ${e}`}></Form.Control>
            </Form.Group>
          }
        }) : false : ""}
        {showFields ? collection.additionalFields[1] ? collection.additionalFields[1].map((e, i) => {
          if (e) {
            return <Form.Group key={e}>
              <Form.Label className="names-numbers">{e}</Form.Label>
              <Form.Control type="text" className="numbers" placeholder={`Введите поле ${e}`}></Form.Control>
            </Form.Group>
          }
        }) : false : ""}
        {showFields ? collection.additionalFields[2] ? collection.additionalFields[2].map((e, i) => {
          if (e) {
            return <Form.Group key={e}>
              <Form.Label className="names-booleans">{e}</Form.Label>
              <Form.Check className="booleans" type="checkbox"></Form.Check>
            </Form.Group>
          }
        }) : false : ""}
        {showFields ? collection.additionalFields[3] ? collection.additionalFields[3].map((e, i) => {
          if (e) {
            return <Form.Group key={e}>
              <Form.Label className="names-dates">{e}</Form.Label>
              <Form.Control className="dates" type="date"></Form.Control>
            </Form.Group>
          }
        }) : false : ""}
        {!isShow ? <Button onClick={() => handleClickShowFields()}>Добавление дополнительных полей</Button> : <Button onClick={() => handleClickHideFields()}>Скрыть дополнительные поля</Button>}
        {isShow ?
          <div>
            <div>
              <h5>Строковые</h5>
              <div className="d-flex align-items-center" style={{ columnGap: 10 }}>
                <Form.Group className="d-flex" style={{ columnGap: 10 }}>
                  <Form.Control type="text" className="controls" placeholder="Название поля"></Form.Control>
                </Form.Group>
              </div>
            </div>
            <div>
              <h5>Целочисленные</h5>
              <div className="d-flex align-items-center" style={{ columnGap: 10 }}>
                <Form.Group className="d-flex" style={{ columnGap: 10 }}>
                  <Form.Control type="text" className="controls" placeholder="Название поля"></Form.Control>
                </Form.Group>
              </div>
            </div>
            <div>
              <h5>Логические</h5>
              <div className="d-flex align-items-center" style={{ columnGap: 10 }}>
                <Form.Group className="d-flex" style={{ columnGap: 10 }}>
                  <Form.Control type="text" className="controls" placeholder="Название поля"></Form.Control>
                </Form.Group>
              </div>
            </div>
            <div>
              <h5>Даты</h5>
              <div className="d-flex align-items-center" style={{ columnGap: 10 }}>
                <Form.Group className="d-flex" style={{ columnGap: 10 }}>
                  <Form.Control type="text" className="controls" placeholder="Название поля"></Form.Control>
                </Form.Group>
              </div>
            </div>
            <Button variant="dark" className="d-flex mt-2" onClick={(e) => handleClickAddFields(e)}>Добавить</Button>
          </div> : false
        }
        {editMode ? <ButtonGroup>
          < Button variant="dark" onClick={() => handleClickEditItem()}> Отредактировать элемент</Button >
          <Button variant="secondary" onClick={() => handleClickCancel()}>Отменить</Button>
        </ButtonGroup > : <Button variant="success" onClick={(e) => handleClickCreateItem(e)}>Создать элемент</Button>}
      </Form >
      <div className="p-3">
        <h4>Список элементов</h4>
        <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
          {loading ?
            <Table bordered hover>
              <thead>
                <tr>
                  {items[0] ? Object.keys(items[0]).map((head, i) => {
                    if (i < 3 && i > 0) return <th>{head}</th>
                  }) : false}
                  <th>Удалить элемент</th>
                  <th>Страница элемента</th>
                </tr>
              </thead>
              <tbody>
                {items.map(e => {
                  return <tr>
                    {Object.values(e).map(((val, i) => {
                      if (i < 3 && i > 0)
                        return <td>{val.toString()}</td>
                    }))}<td>
                      <ButtonGroup>
                        <Button onClick={() => handleClickDeleteItem(e._id)} variant="danger">Удалить</Button>
                      </ButtonGroup>
                    </td><td>
                      <Button onClick={() => localStorage.setItem('itemStore', JSON.stringify(e))}>
                        <NavLink className="text-light text-decoration-none" to={ITEM_ROUTE}>Перейти</NavLink>
                      </Button>
                    </td>
                  </tr>
                })}
              </tbody>
            </Table> : <Spinner className="position-absolute top-50 start-50" animation="border" />}
        </div>
      </div >
    </div >
  )
})

export default Collection