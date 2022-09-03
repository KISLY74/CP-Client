import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { getItem } from "../http/itemApi"
import { Spinner, Card, ListGroup, Badge, Row, Col } from "react-bootstrap"
import { getCollections } from "../http/collectionApi"
import ListComments from "../components/ListComments"
import CommentForm from "../components/CommentForm"

const Item = observer(() => {
  const { item } = useContext(Context)
  const [itemObj, setItemObj] = useState({})
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const updateTableItem = async () => {
    setLoading(false)
    await getItem(item.id).then((data) => setItemObj(data)).finally(() => setLoading(true))
  }
  const getStateCollections = async () => {
    await getCollections().then((data) => setCollections(data))
  }
  useEffect(() => {
    getStateCollections()
    item.setItem(JSON.parse(localStorage.getItem('itemStore')))
    updateTableItem()
  }, [])
  return (
    <div className="p-3">
      <h2>
        <Badge>{item.name}</Badge>
      </h2>
      {loading ? <Card style={{ maxWidth: 400 }}>
        <Card.Body className="rounded-top" style={{ backgroundColor: '#222', maxHeight: 350 }}>
          <Card.Title>
            {collections.map(collection => {
              if (collection.items.includes(item.id))
                return <div>
                  <Row className="d-flex justify-content-between">
                    <Col>
                      <Badge bg="success">{collection.name}</Badge>
                    </Col>
                  </Row>
                  {localStorage.getItem('username') === "Гость" ? false : <Row className="mt-2">
                    <Col className="d-flex align-items-center justify-content-between" style={{ flexWrap: "wrap" }}>
                      <ListComments itemId={item.id} />
                      <CommentForm itemId={item.id} />
                    </Col>
                  </Row>}
                </div>
            })}
          </Card.Title>
        </Card.Body>
        <ListGroup>
          {Object.keys(itemObj) ? Object.keys(itemObj).map((e, i) => {
            if (i > 0 && e !== "dateAddition" && e !== "isAccess" && e !== "comments") return <ListGroup.Item>{e}: {Object.values(itemObj)[i].toString()}</ListGroup.Item>
          }) : ""}
        </ListGroup>
      </Card> : <Spinner className="position-absolute top-50 start-50" animation="border" />}
    </div >
  )
})

export default Item