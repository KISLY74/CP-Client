import { useContext, useEffect, useState } from "react"
import { getCollections } from "../http/collectionApi"
import { ListGroup, Card, Spinner, Container } from "react-bootstrap"
import { observer } from "mobx-react-lite"
import { Context } from "../index"

const Main = observer(() => {
  const { collection } = useContext(Context)
  const [loading, setLoading] = useState(true)
  return (
    <div className="p-3">
      <h4>Топ 5 самых больших коллекций</h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {JSON.parse(collection.biggest).map((e) => <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} >
          <Card.Body>
            <Card.Title>
              {e.name}
            </Card.Title>
          </Card.Body>
          <ListGroup>
            <ListGroup.Item>Описание: {e.description}</ListGroup.Item>
            <ListGroup.Item>Тема: {e.theme}</ListGroup.Item>
          </ListGroup>
        </Card>)}
      </div>
    </div>
  )
})

export default Main