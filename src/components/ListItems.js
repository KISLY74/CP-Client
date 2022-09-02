import { Table, Button, ButtonGroup, Spinner } from "react-bootstrap"
import { ITEM_ROUTE } from "../utils/routes"
import { NavLink } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { deleteItem, getItemsByCollection } from "../http/itemApi"

const ListItems = observer((props) => {
  const { collection, item, user } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const handleClickDeleteItem = async (id) => {
    await deleteItem(id)
    updateItemsCollection()
  }
  const updateItemsCollection = async () => {
    setLoading(false)
    await getItemsByCollection(collection.id).then(async (data) => {
      setItems(data)
    }).finally(() => setLoading(true))
  }
  const handleClickEditMode = async (id) => {
    item.setEditMode(true)
    items.find(e => {
      if (e._id === id) {
        item.setFields(e)
      }
    })
  }
  useEffect(() => {
    updateItemsCollection()
  }, [])
  return <div className="p-3">
    <h4>Список элементов</h4>
    <div className="d-flex mt-4" style={{ columnGap: 20, flexWrap: "wrap" }}>
      {loading ?
        <Table bordered hover>
          <thead>
            <tr>
              {items[0] ? Object.keys(items[0]).map((head, i) => {
                if (i < 3 && i > 0) return <th>{head}</th>
              }) : false}
              {props.isAdmin ? <th>Удалить/Редактировать элемент</th> : !props.isView ? <th>Удалить/Редактировать элемент</th> : false}
              <th>Страница элемента</th>
            </tr>
          </thead>
          <tbody>
            {items.map(e => {
              return <tr>
                {Object.values(e).map(((val, i) => {
                  if (i < 3 && i > 0)
                    return <td>{val.toString()}</td>
                }))}
                {props.isAdmin ? <td>
                  <ButtonGroup>
                    <Button onClick={() => handleClickDeleteItem(e._id)} variant="danger">Удалить</Button>
                    <Button onClick={() => handleClickEditMode(e._id)} variant="dark">Редактировать</Button>
                  </ButtonGroup>
                </td> : !props.isView ? <ButtonGroup>
                  <Button onClick={() => handleClickDeleteItem(e._id)} variant="danger">Удалить</Button>
                  <Button onClick={() => handleClickEditMode(e._id)} variant="dark">Редактировать</Button>
                </ButtonGroup> : false}
                <td>
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
})

export default ListItems