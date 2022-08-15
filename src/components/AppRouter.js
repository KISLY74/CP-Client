import { Routes, Route, Navigate } from "react-router-dom"
import Authorization from "../pages/Authorization"
import { REGIN_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, USER_ROUTE } from "../utils/routes"
import Admin from "../pages/Admin"
import User from "../pages/User"

const AppRouter = () => {
  return (
    <Routes>
      <Route path={REGIN_ROUTE} element={<Authorization />} />
      <Route path={LOGIN_ROUTE} element={<Authorization />} />
      <Route path={ADMIN_ROUTE} element={<Admin />} />
      <Route path={USER_ROUTE} element={<User />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default AppRouter