import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import ItemControlPanel from "../components/ItemControlPanel"
import ListItems from "../components/ListItems"

const Collection = observer(() => {
  const { collection, item, user } = useContext(Context)
  useEffect(() => {
    collection.setCollection(JSON.parse(localStorage.getItem('collectionStore')))
  }, [])
  return (
    <div>
      {!localStorage.getItem("isView") ? <div>
        {user.isAuth ? user.roles.includes("ADMIN") ? <ItemControlPanel /> : false : false}
        {item.isLoad ? <ListItems isView={false} /> : false}
      </div> : <div>
        {user.isAuth ? user.roles.includes("ADMIN") ? <ItemControlPanel /> : false : false}
        {item.isLoad ? <ListItems isView={true} /> : false}
      </div>}
    </div >
  )
})

export default Collection