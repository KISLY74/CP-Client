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
      {localStorage.getItem("isView") === "false" ? <div>
        {user.isAuth || user.roles.includes("ADMIN") ? <ItemControlPanel /> : false}
        {item.isLoad ? <ListItems isView={false} /> : false}
      </div> : <div>
        {!user.isAuth ? false : user.roles.includes("ADMIN") ? <ItemControlPanel /> : false}
        {item.isLoad ? !user.isAuth ? <ListItems isView={true} isAdmin={false} /> : user.roles.includes("ADMIN") ? <ListItems isView={true} isAdmin={true} /> : <ListItems isView={true} isAdmin={false} /> : false}
      </div>}
    </div >
  )
})

export default Collection