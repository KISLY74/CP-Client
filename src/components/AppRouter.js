import { Routes, Route, Navigate } from "react-router-dom"
import Authorization from "../pages/Authorization"
import { REGIN_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, USER_ROUTE, COLLECTION_ROUTE } from "../utils/routes"
import Admin from "../pages/Admin"
import User from "../pages/User"
import Collection from "../pages/Collection"

const AppRouter = () => {
  return (
    <Routes>
      <Route path={REGIN_ROUTE} element={<Authorization />} />
      <Route path={LOGIN_ROUTE} element={<Authorization />} />
      <Route path={ADMIN_ROUTE} element={<Admin />} />
      <Route path={USER_ROUTE} element={<User />} />
      <Route path={COLLECTION_ROUTE} element={<Collection />} />
      <Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
    </Routes>
  )
}

export default AppRouter