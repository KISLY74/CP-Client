import { useContext, useEffect, useState } from "react"
import { ListGroup, Card, Button, Badge } from "react-bootstrap"
import { USER_ROUTE } from "../utils/routes"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { useNavigate } from "react-router-dom"
import { getUserByCollection } from "../http/userApi"

const Main = observer(() => {
  const { collection, item, user } = useContext(Context)
  const history = useNavigate()
  const handleClickNormalUser = async (id) => {
    await getUserByCollection(id).then((data) => {
      user.setIsView(true)
      history(USER_ROUTE)
    })
  }
  useEffect(() => {
    user.setIsView(false)
  }, [])
  return (
    <div className="p-3">
      <h2>Главная страница</h2>
      <h4>Топ 5 самых больших коллекций</h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {collection.biggest.map((e) => <Card key={e._id} className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} >
          <Card.Body style={{ backgroundColor: '#222' }}>
            <Card.Title >
              <h4>
                <Badge bg="success">{e.name}</Badge>
              </h4>
            </Card.Title>
          </Card.Body>
          <ListGroup>
            <ListGroup.Item>Описание: {e.description}</ListGroup.Item>
            <ListGroup.Item>Тема: {e.theme}</ListGroup.Item>
            <Button variant="secondary" onClick={() => handleClickNormalUser(e)}>Перейти к пользователю</Button>
          </ListGroup>
        </Card>)}
      </div>
      <h4>Список последних добавленных элементов</h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {item.lastAdditionItems.map((e) => <Card key={e._id} className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} >
          <Card.Body>
            <Card.Title>
              {e.name}
            </Card.Title>
          </Card.Body>
          <ListGroup>
            <ListGroup.Item>Теги: {e.tags.toString()}</ListGroup.Item>
          </ListGroup>
        </Card>)}
      </div>
    </div >
  )
})

export default Main