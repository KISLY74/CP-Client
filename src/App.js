import AppRouter from "./components/AppRouter"
import { BrowserRouter } from "react-router-dom"
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { useEffect, useContext, useState } from "react"
import { getCollections } from "./http/collectionApi";
import { Context } from "./index"
import { check } from "./http/userApi"
import { Spinner } from "react-bootstrap"

const App = observer(() => {
  const { user, collection } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const getCollectionsAndSetToStore = async () => {
    await getCollections().then((data) => {
      collection.setBiggest(JSON.stringify(data.sort((a, b) => b.items.length - a.items.length).slice(0, 5)))
    })
  }
  useEffect(() => {
    getCollectionsAndSetToStore()
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
