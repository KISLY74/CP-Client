import { Button, Navbar } from "react-bootstrap"
import Nav from "react-bootstrap/Nav"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { LOGIN_ROUTE, ADMIN_ROUTE, OWN_PAGE_ROUTE, MAIN_ROUTE, SEARCH_RESULTS_ROUTE } from "../utils/routes"
import { useContext, useEffect, useState } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"

const NavBar = observer(() => {
  const { user } = useContext(Context)
  const location = useLocation()
  const route = location.pathname
  const history = useNavigate()
  const logOut = () => {
    user.setIsAuth(false)
    localStorage.setItem('isView', false)
    localStorage.clear()
    history(LOGIN_ROUTE)
  }
  useEffect(() => {
    user.setUser(JSON.parse(localStorage.getItem('userStore')))
  }, [])
  return (
    <Navbar className="d-flex justify-content-between" style={{ paddingLeft: 15, paddingRight: 15 }
    } bg="dark" variant="dark">
      <h4 className="text-white" id="username">
        {user.isAuth ? user.username : "Гость"}
        {localStorage.getItem('isView') === "true" && route !== MAIN_ROUTE && route !== SEARCH_RESULTS_ROUTE && route !== OWN_PAGE_ROUTE && route !== ADMIN_ROUTE ? `(${JSON.parse(localStorage.getItem('viewUser')).username})` : ""}
      </h4>
      <Nav>
        <NavLink className="nav-link" to={MAIN_ROUTE}>Главная</NavLink>
        <NavLink className="nav-link" to={SEARCH_RESULTS_ROUTE}>Результаты поиска</NavLink>
        {user.isAuth ?
          <Nav style={{ color: 'white' }}>
            {user.roles ? user.roles.includes("ADMIN") ? <NavLink className="nav-link" to={ADMIN_ROUTE}>Администратор</NavLink> : false : user.setUser(JSON.parse(localStorage.getItem('userStore')))}
            <NavLink className="nav-link" to={OWN_PAGE_ROUTE}>Пользователь</NavLink>
            <Button variant={"outline-light"} onClick={() => logOut()}>{user.isAuth ? "Выйти" : "Авторизация"}</Button>
          </Nav> :
          <Nav style={{ color: 'white' }}>
            <Button variant={"outline-light"} onClick={() => logOut()}>{user.isAuth ? "Выйти" : "Авторизация"}</Button>
          </Nav>}
      </Nav>
    </Navbar >
  )
})

export default NavBar