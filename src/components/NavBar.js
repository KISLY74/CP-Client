import { Button, Navbar } from "react-bootstrap"
import Nav from "react-bootstrap/Nav"
import { useNavigate } from "react-router-dom"

const NavBar = () => {
  const history = useNavigate()
  return (
    <Navbar className="d-flex justify-content-between" style={{ paddingLeft: 15, paddingRight: 15 }
    } bg="dark" variant="dark" >
      <Nav style={{ color: 'white' }}>
        <Button variant={"outline-light"} onClick={() => history("/login")} >Авторизация</Button>
      </Nav>
    </Navbar >
  )
}

export default NavBar