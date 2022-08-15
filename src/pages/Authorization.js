import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Container, Card, Form, Button, Row } from "react-bootstrap"

const Authorization = () => {
  const location = useLocation()
  const isLogin = location.pathname === "/login"
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <Button className="mt-3" variant={"outline-success"}>{isLogin ? "Войти" : "Зарегистрироваться"}</Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}

export default Authorization;