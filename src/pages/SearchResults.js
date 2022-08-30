import { observer } from "mobx-react-lite"
import { useState, useEffect, useContext } from "react"
import { Form, FormGroup, Button, Spinner, Card, ListGroup } from "react-bootstrap"
import { Context } from "../index"
import { getItems } from "../http/itemApi"

const SearchResults = observer(() => {
  const { user } = useContext(Context)
  const [tag, setTag] = useState("")
  const [itemsByTag, setItemsByTag] = useState([])
  const [loading, setLoading] = useState(true)
  let items = []
  const searchItemsByTag = async (tagInput) => {
    setLoading(false)
    await getItems().then((data) => data.map(e => {
      e.tags = e.tags.map(el => el.trim(""))
      e.tags.map((str => str.includes(tagInput || tag) ? items.push(e) : false))
    })).finally(() => setLoading(true))
    setItemsByTag(items)
  }
  useEffect(() => {
    user.setIsView(false)
  }, [])
  return (
    <div className="p-3">
      <h2>Страница результатов поиска</h2>
      <Form>
        <FormGroup>
          <Form.Control value={tag} onChange={(e) => {
            setTag(e.target.value)
            searchItemsByTag(e.target.value)
          }} className="fs-3" placeholder="Введите тег" type="text" />
          <Button className="mt-2" variant="secondary" onClick={() => searchItemsByTag(tag)}>Поиск</Button>
        </FormGroup>
      </Form>
      <div className="mt-2">
        <h3>Результаты поиска</h3>
        <div className="d-flex" style={{ flexWrap: "wrap", columnGap: 20 }}>
          {loading ? itemsByTag.map((e, i) => <Card className="mb-4" style={{ minWidth: 300, maxWidth: 300 }} key={i}>
            <Card.Body>
              <Card.Title>
                {e.name}
              </Card.Title>
            </Card.Body>
            <ListGroup>
              <ListGroup.Item>Теги: {e.tags.toString()}</ListGroup.Item>
            </ListGroup>
          </Card>) : <Spinner className="position-absolute top-50 start-50" animation="border" />}
        </div>
      </div>
    </div>
  )
})

export default SearchResults