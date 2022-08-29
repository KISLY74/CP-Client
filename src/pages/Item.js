import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { getItem } from "../http/itemApi"
import { Spinner, Card, ListGroup } from "react-bootstrap"

const Item = observer(() => {
  const { item } = useContext(Context)
  const [itemObj, setItemObj] = useState({})
  const [loading, setLoading] = useState(true)
  const updateTableItem = async () => {
    setLoading(false)
    await getItem(item.id).then((data) => setItemObj(data)).finally(() => setLoading(true))
  }
  useEffect(() => {
    item.setItem(JSON.parse(localStorage.getItem('itemStore')))
    updateTableItem()
  }, [])
  return (
    <div className="p-3">
      <h2>Элемент: {item.name}</h2>
      {loading ? <Card style={{ maxWidth: 400 }}>
        <Card.Body>
          {Object.keys(itemObj) ? Object.keys(itemObj).map((e, i) => {
            if (i > 0 && e !== "dateAddition") return <ListGroup.Item>{e}: {Object.values(itemObj)[i].toString()}</ListGroup.Item>
          }) : ""}
        </Card.Body>
      </Card> : <Spinner className="position-absolute top-50 start-50" animation="border" />}
    </div >
  )
})

export default Item