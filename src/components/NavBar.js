import { Button, Navbar } from "react-bootstrap"
import Nav from "react-bootstrap/Nav"
import { NavLink, useNavigate } from "react-router-dom"
import { USER_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE } from "../utils/routes"
import { useContext } from "react"
import { Context } from "../index"
import { observer } from "mobx-react-lite"

const NavBar = observer(() => {
  const { user } = useContext(Context)
  const history = useNavigate()
  const logOut = () => {
    user.setIsAuth(false)
    localStorage.clear()
    history(LOGIN_ROUTE)
  }
  return (
    <Navbar className="d-flex justify-content-between" style={{ paddingLeft: 15, paddingRight: 15 }
    } bg="dark" variant="dark" >
      <h4 className="text-white">{user.isAuth ? localStorage.getItem('username') : ""}</h4>
      {user.isAuth ?
        <Nav style={{ color: 'white' }}>
          <NavLink className="nav-link" to={ADMIN_ROUTE}>Администратор</NavLink>
          <NavLink className="nav-link" to={USER_ROUTE}>Пользователь</NavLink>
          <Button variant={"outline-light"} onClick={() => logOut()}>{user.isAuth ? "Выйти" : "Авторизация"}</Button>
        </Nav> :
        <Nav style={{ color: 'white' }}>
          <Button variant={"outline-light"} onClick={() => logOut()}>{user.isAuth ? "Выйти" : "Авторизация"}</Button>
        </Nav>}
    </Navbar >
  )
})

export default NavBar