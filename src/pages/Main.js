import { useContext, useEffect, useState } from "react"
import { ListGroup, Card, Badge, Image, Row, Col } from "react-bootstrap"
import { USER_ROUTE } from "../utils/routes"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import { useNavigate } from "react-router-dom"
import { getUserByCollection } from "../http/userApi"
import { getCollections } from "../http/collectionApi"
import { getUsers } from "../http/userApi"
import ListComments from "../components/ListComments"
import CommentForm from "../components/CommentForm"

const Main = observer(() => {
  const { collection, item, user } = useContext(Context)
  const [collections, setCollections] = useState([])
  const [users, setUsers] = useState([])
  const history = useNavigate()
  const handleClickNormalUser = async (id) => {
    await getUserByCollection(id).then((data) => {
      localStorage.setItem('isView', true)
      localStorage.setItem('viewUser', JSON.stringify(data))
      history(USER_ROUTE)
    })
  }
  const getStateCollections = async () => {
    await getCollections().then((data) => setCollections(data))
  }
  const getStateUsers = async () => {
    await getUsers().then((res) => setUsers(res.data))
  }
  useEffect(() => {
    getStateCollections()
    getStateUsers()
  }, [])
  return (
    <div className="p-3">
      <h2>Главная страница</h2>
      <h4>
        Топ 5 самых больших <Badge bg="success">коллекций</Badge>
      </h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {collection.biggest.map((e) => <Card key={e._id} className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} >
          <Card.Body className="rounded-top" style={{ backgroundColor: '#222' }}>
            {users.map(user => {
              if (user.collections.includes(e._id)) {
                return <h5>
                  <Badge className="position-absolute top-0 end-0" bg="secondary" style={{ cursor: "pointer" }} onClick={() => handleClickNormalUser(e._id)}> {user.username}</Badge>
                </h5>
              }
            })}
            <Card.Title >
              <h4>
                <Badge bg="success">{e.name}</Badge>
              </h4>
            </Card.Title>
          </Card.Body>
          <ListGroup>
            <ListGroup.Item>Описание: {e.description}</ListGroup.Item>
            <ListGroup.Item>Тема: {e.theme}</ListGroup.Item>
          </ListGroup>
        </Card>)}
      </div>
      <h4>
        Список последних добавленных <Badge>элементов</Badge>
      </h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {item.lastAdditionItems.map((e) => <Card key={e._id} className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} >
          <Card.Body className="rounded-top" style={{ backgroundColor: '#222', maxHeight: 350 }}>
            {collections.map(collection => {
              if (collection.items.includes(e._id))
                return users.map(user => {
                  if (user.collections.includes(collection._id)) {
                    return <h5>
                      <Badge className="position-absolute top-0 end-0" bg="secondary" style={{ cursor: "pointer" }} onClick={() => handleClickNormalUser(collection._id)}> {user.username}</Badge>
                    </h5>
                  }
                })
            })
            }
            <Card.Title>
              <h4>
                <Badge>{e.name}</Badge>
              </h4>
              {collections.map(collection => {
                if (collection.items.includes(e._id))
                  return <div>
                    <Row className="d-flex justify-content-between">
                      <Col>
                        <Badge bg="success">{collection.name}</Badge>
                      </Col>
                    </Row>
                    {localStorage.getItem('username') === "Гость" ? false : <Row className="mt-2">
                      <Col className="d-flex align-items-center justify-content-between" style={{ flexWrap: "wrap" }}>
                        <ListComments itemId={e._id} />
                        <CommentForm itemId={e._id} />
                      </Col>
                    </Row>}
                  </div>
              })}
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