import { Routes, Route, Navigate } from "react-router-dom"
import Authorization from "../pages/Authorization"
import { REGIN_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, USER_ROUTE } from "../utils/routes"
import Admin from "../pages/Admin"
import User from "../pages/User"
import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { Context } from ".."

const authRoutes = [
  {
    path: ADMIN_ROUTE,
    component: <Admin />
  },
  {
    path: USER_ROUTE,
    component: <User />
  }
]

const publicRoutes = [
  {
    path: REGIN_ROUTE,
    component: <Authorization />
  },
  {
    path: LOGIN_ROUTE,
    component: <Authorization />
  }
]

const AppRouter = observer(() => {
  const { user } = useContext(Context)
  return (
    <Routes>
      {user.isAuth ? authRoutes.map(e => <Route path={e.path} element={e.component} />) : publicRoutes.map(e => <Route path={e.path} element={e.component} />)}
      <Route path="*" element={<Navigate to={user.isAuth ? ADMIN_ROUTE : LOGIN_ROUTE} />} />
    </Routes>
  )
})

export default AppRouter