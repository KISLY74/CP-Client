import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { Table, Form } from "react-bootstrap"
import { getItemsByCollection } from "../http/itemApi"

const Collection = observer(() => {
  const { collection } = useContext(Context)
  const [itemsValues, setItemsValues] = useState([])
  const [headers, setHeaders] = useState([])
  const updateItemsCollection = async () => {
    await getItemsByCollection(collection.id).then((data) => {
      setHeaders(Object.keys(data[0]))
      setItemsValues(data.map((e) => Object.values(e)))
    })
  }
  let checkboxes = []
  document.querySelectorAll(".checkbox").forEach(e => checkboxes.push(e.firstChild))
  const handleClickCheckboxAll = () => {
    if (document.querySelector(".checkbox-all").firstChild.checked) {
      checkboxes.map(e => e.checked = true)
    } else {
      checkboxes.map(e => e.checked = false)
    }
  }
  const handleClickCheckbox = () => {
    if (checkboxes.every(e => e.checked)) {
      document.querySelector(".checkbox-all").firstChild.checked = true
    } else {
      document.querySelector(".checkbox-all").firstChild.checked = false
    }
  }
  useEffect(() => {
    collection.setCollection(JSON.parse(localStorage.getItem('collectionStore')))
    updateItemsCollection()
  }, [])
  return (
    <div className="p-3">
      <h4>Коллекция: {collection.collectionName}</h4>
      <Table bordered hover>
        <thead>
          <tr>
            <th><Form.Check className="checkbox-all" onClick={() => handleClickCheckboxAll()} />Выделить/Снять всё</th>
            {headers ? headers.map((e, i) => <th>{`${e}`}</th>) : ""}
          </tr>
        </thead>
        <tbody>
          {itemsValues ? itemsValues.map((el, ind) => el ? <tr key={ind}><td><Form.Check className="checkbox" onClick={() => handleClickCheckbox()} key={ind} /></td>{el.map((e, i) => <td key={i}>{`${e}`}</td>
          )}</tr> : '') : ''}
        </tbody>
      </Table>
    </div>
  )
})

export default Collection