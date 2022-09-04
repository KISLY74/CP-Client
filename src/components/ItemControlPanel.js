import { observer } from "mobx-react-lite"
import { Form, Button, ButtonGroup } from "react-bootstrap"
import { Context } from "../index"
import { useContext, useEffect, useState } from "react"
import { addAdditionalFields, getAdditionalFields, getCollections } from "../http/collectionApi"
import { createItem, editItem, getItems } from "../http/itemApi"

const ItemControlPanel = observer(() => {
  const { collection, item } = useContext(Context)
  const [isShow, setIsShow] = useState(false)
  const [showFields, setShowFields] = useState(false)
  const [name, setName] = useState('')
  const [tags, setTags] = useState('')
  const titles = ["Строки", "Числа", "Логические (Да/Нет)", "Даты", "Многострочный текст"]
  const classesLabels = ["names-strings", "names-numbers", "names-booleans", "names-dates", "names-texts"]
  const classesValues = ["strings", "numbers", "booleans", "dates", "texts"]
  let names = classesLabels.map(e => document.querySelectorAll(`.${e}`))
  let fields = classesValues.map(e => document.querySelectorAll(`.${e}`))
  const updateAdditionalFields = async () => {
    await getAdditionalFields(collection.id).then((data) => {
      collection.setAdditionalFields([data.stringsFields, data.numbersFields, data.booleansFields, data.datesFields, data.textsFields])
    }).finally(() => setShowFields(true))
  }
  const getCollectionsAndSetToStore = async () => {
    await getCollections().then((data) => {
      collection.setBiggest(data.sort((a, b) => b.items.length - a.items.length).slice(0, 5))
    })
  }
  const handleClickAddFields = async () => {
    let controls = document.querySelectorAll(".controls")
    let names = []
    controls.forEach(e => names.push(e.value))
    await addAdditionalFields(collection.id, ...names).finally(() => {
      updateAdditionalFields()
    })
  }
  const clearFormCollection = () => {
    setName('')
    setTags('')
    for (let i = 0; i < fields.length; i++) {
      for (let j = 0; j < fields[i].length; i++) {
        fields[i][j].value = ""
      }
    }
  }
  const getItemsAndSetToStore = async () => {
    await getItems().then((data) => item.setLastAdditionItems(data.sort((a, b) => new Date(b.dateAddition) - new Date(a.dateAddition)).slice(0, 5)))
  }
  const handleClickCreateItem = async () => {
    if (getAdditionalFieldsByForm() !== null) {
      item.setIsLoad(false)
      await createItem(name, tags.split(','), collection.id, getAdditionalFieldsByForm()).finally(() => {
        item.setIsLoad(true)
        getItemsAndSetToStore()
        getCollectionsAndSetToStore()
      })
      setIsShow(false)
      clearFormCollection()
    }
  }
  const handleClickCancel = async () => {
    item.setEditMode(false)
    clearFormCollection()
  }
  const handleClickEditItem = async () => {
    item.setIsLoad(false)
    await editItem(item.fields._id, name, tags.split(','), getAdditionalFieldsByForm()).finally(() => {
      item.setIsLoad(true)
      handleClickCancel()
      getItemsAndSetToStore()
      getCollectionsAndSetToStore()
    })
  }
  const getAdditionalFieldsByForm = () => {
    let additionalFields = [{}, {}, {}, {}, {}]
    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < fields[i].length; j++) {
        if (i === 2) {
          additionalFields[i][names[i][j].textContent] = fields[i][j].childNodes[0].checked
        } else {
          if (fields[i][j].value === '') {
            alert("Запоните пустые поля")
            return null
          } else {
            additionalFields[i][names[i][j].textContent] = fields[i][j].value
          }
        }
      }
    }
    return additionalFields
  }
  useEffect(() => {
    updateAdditionalFields()
  }, [])
  return <Form className="p-3 d-flex" style={{ maxWidth: 850, rowGap: 14, flexDirection: "column" }}>
    <h2>Коллекция: {collection.collectionName}</h2>
    <h4>{item.editMode ? `Редактирование элемента` : "Создание элемента"}</h4>
    <Form.Group>
      <Form.Label>Название</Form.Label>
      <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите название элемента" />
    </Form.Group>
    <Form.Group>
      <Form.Label>Теги</Form.Label>
      <Form.Control as="textarea" rows={3} value={tags} placeholder="Введите теги через запятую" onChange={(e) => setTags(e.target.value)} />
    </Form.Group>
    {showFields ? collection.additionalFields.map((e, ind) => {
      return e.map((field, i) => {
        if (field) {
          return <Form.Group key={`${field}${i}`}>
            <Form.Label className={classesLabels[ind]}>{field}</Form.Label>
            {ind < 2 ? <Form.Control type="text" className={classesValues[ind]} placeholder={`Введите поле ${field}`}></Form.Control> : ind === 2 ? <Form.Check className="booleans" type="checkbox"></Form.Check> : ind === 3 ? <Form.Control className="dates" type="date"></Form.Control> : ind === 4 ? <Form.Control className="texts" as="textarea"></Form.Control> : false}
          </Form.Group>
        }
      })
    }) : false}
    {!item.editMode ? !isShow ? <Button onClick={() => setIsShow(true)}>Добавление дополнительных полей</Button> : <Button onClick={() => setIsShow(false)}>Скрыть дополнительные поля</Button> : false}
    {
      isShow ?
        <div>
          {titles.map(e => {
            return <div>
              <h5>{e}</h5>
              <div className="d-flex align-items-center" style={{ columnGap: 10 }}>
                <Form.Group key={e} className="d-flex" style={{ columnGap: 10 }}>
                  <Form.Control type="text" className="controls" placeholder="Название поля"></Form.Control>
                </Form.Group>
              </div>
            </div>
          })}
          <Button variant="dark" className="d-flex mt-2" onClick={(e) => handleClickAddFields(e)}>Добавить</Button>
        </div> : false
    }
    {
      item.editMode ? <ButtonGroup>
        < Button variant="dark" onClick={() => handleClickEditItem()}> Отредактировать элемент</Button >
        <Button variant="secondary" onClick={() => handleClickCancel()}>Отменить</Button>
      </ButtonGroup> : <Button variant="success" onClick={() => handleClickCreateItem()}>Создать элемент</Button>
    }
  </Form >
})

export default ItemControlPanel