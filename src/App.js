import AppRouter from "./components/AppRouter"
import { BrowserRouter } from "react-router-dom"
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { useEffect, useContext, useState } from "react"
import { getCollections } from "./http/collectionApi";
import { Context } from "./index"
import { check } from "./http/userApi"
import { getItems } from "./http/itemApi";
import { Spinner } from "react-bootstrap"

const App = observer(() => {
  const { user, collection, item } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const getCollectionsAndSetToStore = async () => {
    await getCollections().then((data) => {
      collection.setBiggest(data.sort((a, b) => b.items.length - a.items.length).slice(0, 5))
    })
  }
  const getItemsAndSetToStore = async () => {
    await getItems().then((data) => item.setLastAdditionItems(data.sort((a, b) => new Date(b.dateAddition) - new Date(a.dateAddition)).slice(0, 5)))
  }
  useEffect(() => {
    getCollectionsAndSetToStore()
    getItemsAndSetToStore()
    check().then(() => {
      user.setIsAuth(true)
    }).catch(() => user.setIsAuth(false)).finally(() => setLoading(false))
  }, [])
  if (loading) {
    return <Spinner className="position-absolute top-50 start-50" animation="border" />
  }
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
})

export default App;
