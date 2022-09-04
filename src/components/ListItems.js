import { Table, Button, ButtonGroup, Spinner } from "react-bootstrap"
import { ITEM_ROUTE } from "../utils/routes"
import { NavLink } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { closeAccess, deleteItem, getItemsByCollection, openAccess, getItems } from "../http/itemApi"
import { changeItemsInCollection } from "../http/collectionApi"

const ListItems = observer((props) => {
  const { collection, item, user } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const getItemsAndSetToStore = async () => {
    await getItems().then((data) => item.setLastAdditionItems(data.sort((a, b) => new Date(b.dateAddition) - new Date(a.dateAddition)).slice(0, 5)))
  }
  const handleClickDeleteItem = async (id) => {
    await deleteItem(id)
    await changeItemsInCollection(collection.id)
    updateItemsCollection()
    getItemsAndSetToStore()
  }
  const updateItemsCollection = async () => {
    setLoading(false)
    await getItemsByCollection(JSON.parse(localStorage.getItem('collectionStore'))._id).then(async (data) => setItems(data)).finally(() => setLoading(true))
  }
  const handleClickEditMode = async (id) => {
    item.setEditMode(true)
    items.find(e => {
      if (e._id === id) {
        item.setFields(e)
      }
    })
    getItemsAndSetToStore()
  }
  const getDeleteEditGroup = (e) => {
    return <ButtonGroup>
      <Button onClick={() => handleClickDeleteItem(e._id)} variant="danger">Удалить</Button>
      <Button onClick={() => handleClickEditMode(e._id)} variant="dark">Редактировать</Button>
    </ButtonGroup>
  }
  const getOpenCloseGroup = (e) => {
    return <ButtonGroup>
      {!e.isAccess ? <Button onClick={() => handleClickOpenAccess(e._id)} variant="success">Открыть</Button> : <Button onClick={() => handleClickCloseAccess(e._id)} variant="danger">Закрыть</Button>}
    </ButtonGroup>
  }
  const handleClickOpenAccess = async (id) => {
    await openAccess(id)
    updateItemsCollection()
  }
  const handleClickCloseAccess = async (id) => {
    await closeAccess(id)
    updateItemsCollection()
  }
  useEffect(() => {
    updateItemsCollection()
  }, [])
  return <div className="p-3">
    <h4>Список элементов</h4>
    <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
      {loading ?
        <div style={{ overflowY: "hidden", overflowX: "scroll" }}>
          <Table bordered hover>
            <thead>
              <tr>
                {items[0] ? Object.keys(items[0]).map((head, i) => {
                  if (typeof Object.values(items[0])[i] === "string" && head !== "_id") return <th>{head}</th>
                }) : false}
                {props.isAdmin ? <th>Удалить/Редактировать элемент</th> : !props.isView ? <th>Удалить/Редактировать элемент</th> : false}
                {props.isAdmin ? <th>Доступ для просмотра</th> : !props.isView ? <th>Доступ для просмотра</th> : false}
                <th>Страница элемента</th>
              </tr>
            </thead>
            <tbody>
              {items.map(e => {
                return <tr>
                  {Object.values(e).map(((val, i) => {
                    if (typeof val === "string" && Object.keys(items[0])[i] !== "_id")
                      return <td>{val.toString()}</td>
                  }))}
                  {props.isAdmin ? <td>{getDeleteEditGroup(e)}</td> : !props.isView ? <td>{getDeleteEditGroup(e)}</td> : false}
                  {props.isAdmin ? <td>{getOpenCloseGroup(e)}</td> : !props.isView ? <td>{getOpenCloseGroup(e)}</td> : false}
                  <td>
                    <Button onClick={() => localStorage.setItem('itemStore', JSON.stringify(e))}>
                      <NavLink className="text-light text-decoration-none" to={ITEM_ROUTE}>Перейти</NavLink>
                    </Button>
                  </td>
                </tr>
              })}
            </tbody>
          </Table>
        </div>
        : <Spinner className="position-absolute top-50 start-50" animation="border" />}
    </div>
  </div >
})

export default ListItems