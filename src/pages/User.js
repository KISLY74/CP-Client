import { useContext, useEffect } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"
import { LOGIN_ROUTE } from "../utils/routes"
import { useNavigate } from "react-router-dom"
import CollectionControlPanel from "../components/CollectionControlPanel"
import ListCollection from "../components/ListCollections"

const User = observer((props) => {
  const { user, collection } = useContext(Context)
  const history = useNavigate()
  useEffect(() => {
    props.isOwn ? user.setIsView(false) : user.setIsView(true)
  }, [])
  return (
    <div>
      {user.isAuth ?
        <div>
          {props.isOwn ?
            <div>
              {collection.isLoad ?
                <div>
                  <CollectionControlPanel />
                  <ListCollection isOwn={true} />
                </div> : false}
            </div> : <div>
              {user.roles.includes("ADMIN") ? <CollectionControlPanel /> : false}
              {collection.isLoad ? <ListCollection isOwn={false} /> : false}
            </div>}
        </div > : history(LOGIN_ROUTE)}
    </div >
  )
})

export default User