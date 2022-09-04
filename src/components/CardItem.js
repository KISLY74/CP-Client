import { useContext, useEffect, useState } from "react"
import { getItem } from "../http/itemApi"
import { Spinner, Card, ListGroup, Badge, Row, Col } from "react-bootstrap"
import { getCollections } from "../http/collectionApi"
import ListComments from "../components/ListComments"
import CommentForm from "../components/CommentForm"
import { getUserByCollection, getUsers } from "../http/userApi"
import { useNavigate } from "react-router-dom"
import { USER_ROUTE } from "../utils/routes"

const CardItem = (props) => {
  const history = useNavigate()
  const [users, setUsers] = useState([])
  const [itemObj, setItemObj] = useState({})
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
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
  const updateTableItem = async () => {
    setLoading(false)
    await getItem(props.item._id).then((data) => setItemObj(data)).finally(() => setLoading(true))
  }
  useEffect(() => {
    getStateUsers()
    getStateCollections()
    updateTableItem()
  }, [])
  return (<div>
    {loading ? <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }}>
      <Card.Body className="rounded-top" style={{ backgroundColor: '#222', maxHeight: 500 }}>
        {collections.map(collection => {
          if (collection.items.includes(props.item._id))
            return users.map(user => {
              if (user.collections.includes(collection._id)) {
                return <h5>
                  <Badge className="position-absolute top-0 end-0" bg="secondary" style={{ cursor: "pointer" }} onClick={() => handleClickNormalUser(collection._id)}> {user.username}</Badge>
                </h5>
              }
            })
        })
        }
        <h4>
          <Badge>{props.item.name}</Badge>
        </h4>
        <Card.Title>
          {collections.map(collection => {
            if (collection.items.includes(props.item._id))
              return <div>
                <Row className="d-flex justify-content-between">
                  <Col>
                    <Badge bg="success">{collection.name}</Badge>
                  </Col>
                </Row>
                {localStorage.getItem('username') === "Гость" ? false : <Row className="mt-2">
                  <Col className="d-flex align-items-center justify-content-between" style={{ flexWrap: "wrap" }}>
                    <ListComments itemId={props.item._id} />
                    <CommentForm itemId={props.item._id} />
                  </Col>
                </Row>}
              </div>
          })}
        </Card.Title>
      </Card.Body>
      {props.allFields ?
        <ListGroup>
          {Object.keys(itemObj) ? Object.keys(itemObj).map((e, i) => {
            if (i > 0 && e !== "dateAddition" && e !== "isAccess" && e !== "comments") return <ListGroup.Item>{e}: {Object.values(itemObj)[i].toString()}</ListGroup.Item>
          }) : ""}
        </ListGroup> : <ListGroup>
          <ListGroup.Item>Теги: {props.item.tags.toString()}</ListGroup.Item>
        </ListGroup>}
    </Card> : <Spinner className="position-absolute top-50 start-50" animation="border" />}
  </div>)
}

export default CardItem