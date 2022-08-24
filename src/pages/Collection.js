import { observer } from "mobx-react-lite"
import { useContext, useEffect } from "react"
import { Context } from "../index"

const Collection = observer(() => {
  const { collection } = useContext(Context)
  useEffect(() => {
    collection.setCollection(JSON.parse(localStorage.getItem('collectionStore')))
  }, [])
  return (
    <div className="p-3">
      <h4>Коллекция: {collection.collectionName}</h4>
    </div>
  )
})

export default Collection