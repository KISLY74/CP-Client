import AppRouter from "./components/AppRouter"
import { BrowserRouter } from "react-router-dom"
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { useEffect, useContext } from "react"
import { Context } from "./index"
import { check } from "./http/userApi"

const App = observer(() => {
  const { user } = useContext(Context)
  useEffect(() => {
    check().then(() => {
      user.setIsAuth(true)
    }).catch(() => user.setIsAuth(false))
  }, [])
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
})

export default App;
