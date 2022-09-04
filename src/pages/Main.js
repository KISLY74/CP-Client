import { useContext, useEffect, useState } from "react"
import { Badge } from "react-bootstrap"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import CardItem from "../components/CardItem"
import CardCollection from "../components/CardCollection"

const Main = observer(() => {
  const { collection, item } = useContext(Context)
  return (
    <div className="p-3">
      <h2>Главная страница</h2>
      <h4>
        Топ 5 самых больших <Badge bg="success">коллекций</Badge>
      </h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {collection.biggest.map((e) => <CardCollection collection={e} isOwn={false} />)}
      </div>
      <h4>
        Список последних добавленных <Badge>элементов</Badge>
      </h4>
      <div className="d-flex" style={{ columnGap: 25, flexWrap: "wrap" }}>
        {item.lastAdditionItems.map((e) => <CardItem item={e} allFields={false} />)}
      </div>
    </div>
  )
})

export default Main