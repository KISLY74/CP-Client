import { useContext, useEffect } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import CollectionControlPanel from "../components/CollectionControlPanel"
import ListCollection from "../components/ListCollections"

const User = observer((props) => {
  const { user, collection } = useContext(Context)
  const history = useNavigate()
  useEffect(() => {
    props.isOwn ? localStorage.setItem('isView', false) : localStorage.setItem('isView', true)
  }, [])
  return (
    <div>
      {props.isOwn ?
        <div>
          {collection.isLoad ?
            <div>
              <CollectionControlPanel />
              <ListCollection isOwn={true} />
            </div> : false}
        </div> : <div>
          {!user.isAuth ? user.setUser({ username: "Гость", roles: ["USER"] }) : user.roles.includes("ADMIN") ? <CollectionControlPanel /> : false}
          {collection.isLoad ? <ListCollection isOwn={false} /> : false}
        </div>}
    </div >
  )
})

export default User