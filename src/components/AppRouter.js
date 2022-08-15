import { Routes, Route, Navigate } from "react-router-dom"
import Authorization from "../pages/Authorization"
import { REGIN_ROUTE, LOGIN_ROUTE } from "../utils/routes"

const AppRouter = () => {
  return (
    <Routes>
      <Route path={REGIN_ROUTE} element={<Authorization />} />
      <Route path={LOGIN_ROUTE} element={<Authorization />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default AppRouter