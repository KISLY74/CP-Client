import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Container, Card, Form, Button, Row } from "react-bootstrap"
import { login, regin, getOneUser } from "../http/userApi"
import { ADMIN_ROUTE, USER_ROUTE } from "../utils/routes";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Authorization = observer(() => {
  const { user } = useContext(Context)
  const location = useLocation()
  const isLogin = location.pathname === "/login"
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useNavigate()
  const checkStatusAuth = async () => {
    await getOneUser(email).then((res) => {
      if (res.data.status === "Block") {
        user.setIsAuth(false)
        user.setIsBlock(true)
        alert("Вы заблокированы")
      } else {
        user.setIsAuth(true)
        alert("Успешно авторизован")
      }
      user.setUser(res.data)
      localStorage.setItem("username", res.data.username)
      res.data.roles.includes("ADMIN") ? history(ADMIN_ROUTE) : history(USER_ROUTE)
    })
  }
  const handleClickReginLogin = async () => {
    try {
      if (isLogin) {
        await login(email, password).then(() => checkStatusAuth()).catch((e) => alert(e.response.data.message))
      } else {
        await regin(email, password, username).then(() => alert("Успешно зарегистрирован")).catch((e) => alert(e.response.data.message))
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        <Form className="d-flex flex-column">
          {!isLogin ? <Form.Control
            className="mt-3"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          /> : ""}
          <Form.Control
            className="mt-3"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите пароль"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Row className="d-flex justify-content-between mt-3">
            {isLogin ? <div>Нет аккаунта?
              <NavLink style={{ textDecoration: "none" }} to="/regin"> Зарегистрируйтесь!</NavLink>
            </div> : <div>Есть аккаунт?
              <NavLink style={{ textDecoration: "none" }} to="/login"> Войдите!</NavLink>
            </div>}
            <Button className="mt-3" variant={"outline-success"} onClick={() => handleClickReginLogin()}>{isLogin ? "Войти" : "Зарегистрироваться"}</Button>
          </Row>
        </Form>
      </Card>
    </Container >
  );
})

export default Authorization;