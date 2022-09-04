import { Table, Button, ButtonGroup, Spinner, Container, Form, Badge, Row } from "react-bootstrap"
import { ITEM_ROUTE } from "../utils/routes"
import { NavLink } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { closeAccess, deleteItem, getItemsByCollection, openAccess, getItems } from "../http/itemApi"
import { changeItemsInCollection, getCollections } from "../http/collectionApi"

const ListItems = observer((props) => {
  const { collection, item, user } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [sort, setSort] = useState('возрастанию')
  const [field, setField] = useState('name')
  const [itemsFS, setItemsFS] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const getItemsAndSetToStore = async () => {
    await getItems().then((data) => item.setLastAdditionItems(data.sort((a, b) => new Date(b.dateAddition) - new Date(a.dateAddition)).slice(0, 5)))
  }
  const getCollectionsAndSetToStore = async () => {
    await getCollections().then((data) => {
      collection.setBiggest(data.sort((a, b) => b.items.length - a.items.length).slice(0, 5))
    })
  }
  const handleClickDeleteItem = async (id) => {
    await deleteItem(id)
    await changeItemsInCollection(collection.id)
    updateItemsCollection()
    getItemsAndSetToStore()
    getCollectionsAndSetToStore()
  }
  const updateItemsCollection = async () => {
    setLoading(false)
    await getItemsByCollection(JSON.parse(localStorage.getItem('collectionStore'))._id).then((data) => {
      setItemsFS(data)
      if (filterValue === '') {
        if (sort === "возрастанию") {
          setItems(data.sort((a, b) => a[field] > b[field] ? 1 : -1))
        } else {
          setItems(data.sort((a, b) => a[field] < b[field] ? 1 : -1))
        }
      } else {
        setItems(data.filter(e => e[field] === filterValue))
      }
    }).finally(() => setLoading(true))
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
      <div style={{ overflowY: "hidden", overflowX: "scroll" }}>
        <Form className="mb-3 d-flex" style={{ columnGap: 10, rowGap: 10 }}>
          <Container>
            <Row className="d-flex justify-content-evenly" style={{ columnGap: 10, rowGap: 10 }}>
              <Form.Group className="d-flex" style={{ maxWidth: 400, columnGap: 10, rowGap: 10, flexWrap: "wrap" }}>
                <h4>
                  <Badge bg="dark">Сортировка</Badge>
                </h4>
                <Form.Select value={field} onChange={(e) => setField(e.target.value)}>
                  {itemsFS[0] ? Object.keys(itemsFS[0]).map((head, i) => {
                    if (typeof Object.values(itemsFS[0])[i] === "string" && head !== "_id" && head !== "dateAddition") {
                      return <option>{head}</option>
                    }
                  }) : false}
                </Form.Select>
                <h4>
                  <Badge bg="secondary">по</Badge>
                </h4>
                <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option>возрастанию</option>
                  <option>убыванию</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="d-flex" style={{ maxWidth: 400, columnGap: 10, rowGap: 10, flexWrap: "wrap" }}>
                <h4>
                  <Badge bg="dark">Фильтрация</Badge>
                </h4>
                <Form.Select value={field} onChange={(e) => setField(e.target.value)}>
                  {itemsFS[0] ? Object.keys(itemsFS[0]).map((head, i) => {
                    if (typeof Object.values(itemsFS[0])[i] === "string" && head !== "_id" && head !== "dateAddition") {
                      return <option>{head}</option>
                    }
                  }) : false}
                </Form.Select>
                <h4>
                  <Badge bg="secondary">по</Badge>
                </h4>
                <Form.Control value={filterValue} placeholder="значение поля" onChange={(e) => setFilterValue(e.target.value)}>
                </Form.Control>
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <Button onClick={() => updateItemsCollection()}>Обновить</Button>
            </Row>
          </Container>
        </Form>
        {loading ?
          <div>
            <Table bordered hover>
              <thead>
                <tr>
                  {items[0] ? Object.keys(items[0]).map((head, i) => {
                    if (typeof Object.values(items[0])[i] === "string" && head !== "_id" && head !== "dateAddition") return <th>{head}</th>
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
                      if (typeof val === "string" && Object.keys(items[0])[i] !== "_id" && Object.keys(items[0])[i] !== "dateAddition")
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
          : <Button className="mt-3 d-flex justify-content-center" variant="dark">
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>}
      </div>
    </div>
  </div >
})

export default ListItems