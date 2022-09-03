import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { getItem } from "../http/itemApi"
import { Spinner } from "react-bootstrap"
import CardItem from "../components/CardItem"

const Item = observer(() => {
  const [itemObj, setItemObj] = useState({})
  const { item } = useContext(Context)
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
      {loading ? <CardItem item={itemObj} allFields={true} /> : <Spinner className="position-absolute top-50 start-50" animation="border" />}
    </div >
  )
})

export default Item