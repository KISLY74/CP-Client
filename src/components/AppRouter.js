import { Routes, Route, Navigate } from "react-router-dom"
import Authorization from "../pages/Authorization"
import { REGIN_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE, USER_ROUTE, COLLECTION_ROUTE, ITEM_ROUTE, MAIN_ROUTE, SEARCH_RESULTS_ROUTE } from "../utils/routes"
import Admin from "../pages/Admin"
import User from "../pages/User"
import Collection from "../pages/Collection"
import Item from "../pages/Item"
import Main from "../pages/Main"
import SearchResults from "../pages/SearchResults"

const AppRouter = () => {
  return (
    <Routes>
      <Route path={REGIN_ROUTE} element={<Authorization />} />
      <Route path={LOGIN_ROUTE} element={<Authorization />} />
      <Route path={ADMIN_ROUTE} element={<Admin />} />
      <Route path={USER_ROUTE} element={<User />} />
      <Route path={COLLECTION_ROUTE} element={<Collection />} />
      <Route path={ITEM_ROUTE} element={<Item />} />
      <Route path={MAIN_ROUTE} element={<Main />} />
      <Route path={SEARCH_RESULTS_ROUTE} element={<SearchResults />} />
      <Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
    </Routes>
  )
}

export default AppRouter