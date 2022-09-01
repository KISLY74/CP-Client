import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import ItemControlPanel from "../components/ItemControlPanel"
import ListItems from "../components/ListItems"

const Collection = observer(() => {
  const { collection, item } = useContext(Context)
  useEffect(() => {
    collection.setCollection(JSON.parse(localStorage.getItem('collectionStore')))
  }, [])
  return (
    <div>
      <ItemControlPanel />
      {item.isLoad ? <ListItems /> : false}
    </div >
  )
})

export default Collection