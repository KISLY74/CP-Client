import { Table, Form, ButtonGroup, Button, Spinner, ListGroup } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import { getUsers, changeStatus, getOneUser, deleteUser, addUserToAdmins, removeUserFromAdmins } from "../http/userApi"
import { LOGIN_ROUTE, USER_ROUTE } from "../utils/routes"
import { useNavigate, NavLink } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Context } from "../index"

const Admin = observer(() => {
  const { user } = useContext(Context)
  const history = useNavigate()
  const [users, setUsers] = useState([])
  const [usersValues, setUsersValues] = useState([])
  const [headers, setHeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const updateTableUsers = async () => {
    setLoading(false)
    try {
      await getUsers().then((data) => {
        setUsers(data.data)
        setUsersValues(data.data.map(e => Object.values(e)))
        setHeaders(Object.keys(data.data[0]))
      }).finally(() => setLoading(true))
    } catch (e) {
      console.log(e)
    }
    return users
  }
  useEffect(() => {
    localStorage.setItem('isView', false)
    updateTableUsers()
  }, [])
  let checkboxes = []
  document.querySelectorAll(".checkbox").forEach(e => checkboxes.push(e.firstChild))
  const handleClickCheckboxAll = () => {
    if (document.querySelector(".checkbox-all").firstChild.checked) {
      checkboxes.map(e => e.checked = true)
    } else {
      checkboxes.map(e => e.checked = false)
    }
  }
  const handleClickCheckbox = () => {
    if (checkboxes.every(e => e.checked)) {
      document.querySelector(".checkbox-all").firstChild.checked = true
    } else {
      document.querySelector(".checkbox-all").firstChild.checked = false
    }
  }
  const checkStatus = async () => {
    await getOneUser(user.email).then((data) => {
      if (data.status === "Block") {
        user.setIsAuth(false)
        user.setIsBlock(true)
      } else {
        user.setIsAuth(true)
      }
    })
  }
  const handleClickDelete = async (email) => {
    await deleteUser(email).then(() => updateTableUsers())
  }
  const handleClickChangeStatus = (event) => {
    setLoading(false)
    checkStatus().then(() => {
      checkboxes.map(async (e, i) => {
        if (checkboxes[i].checked) {
          await changeStatus(users[i].email, event.target.textContent).finally(() => setLoading(true))
          checkboxes[i].checked = false
          document.querySelector(".checkbox-all").firstChild.checked = false
          updateTableUsers()
          checkStatus()
          if (event.target.textContent === "Delete") handleClickDelete(users[i].email)
        }
      })
    })
  }
  const handleClickAddRemove = (event) => {
    setLoading(false)
    checkboxes.map(async (e, i) => {
      if (checkboxes[i].checked) {
        if (Number(event.target.id) === 1) {
          await addUserToAdmins(users[i].email).finally(() => setLoading(true))
        } else {
          await removeUserFromAdmins(users[i].email).finally(() => setLoading(true))
        }
        checkboxes[i].checked = false
        document.querySelector(".checkbox-all").firstChild.checked = false
        updateTableUsers()
      }
    })
  }
  const handleClickViewUser = (e) => {
    users.map(el => {
      if (Object.values(el)[0] === e[0]) {
        localStorage.setItem('viewUser', JSON.stringify(el))
        localStorage.setItem('isView', true)
      }
    })
  }
  return (
    <div>
      {user.isAuth ?
        <div className="p-4">
          <h1>Пользователи</h1>
          <ButtonGroup className="mb-1 mt-3" aria-label="Basic example" onClick={(e) => handleClickChangeStatus(e)}>
            <Button variant="success">Unblock</Button>
            <Button variant="warning">Block</Button>
            <Button variant="danger">Delete</Button>
            {loading ? false : <Button className="d-flex justify-content-center" variant="dark">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>}
          </ButtonGroup>
          <Table bordered hover>
            <thead>
              <tr>
                <th><Form.Check className="checkbox-all" onClick={() => handleClickCheckboxAll()} />Выделить/Снять всё</th>
                {headers ? headers.map((e, i) => (i !== 2 && i !== 0 && i !== 6) ? <th key={e}>{`${e}`}</th> : "") : ""}
                <th>Страница пользователя</th>
              </tr>
            </thead>
            <tbody>
              {usersValues ? usersValues.map((el, ind) => el ? <tr key={ind}><td><Form.Check onClick={() => handleClickCheckbox()} className="checkbox" key={ind} /></td>{el.map((e, i) => {
                if (i !== 2 && i !== 0 && i !== 6) return <td key={i}>{`${e}`}</td>
              })}<td><Button onClick={() => handleClickViewUser(el)}>
                <NavLink className="text-light text-decoration-none" to={USER_ROUTE}>Перейти</NavLink>
              </Button></td></tr> : '') : ''}
            </tbody>
          </Table >
          <ButtonGroup className="d-flex" aria-label="Basic example" onClick={(e) => handleClickAddRemove(e)}>
            <Button variant="outline-success" id={1}>Add to admins</Button>
            <Button variant="outline-danger" id={2}>Remove from admins</Button>
          </ButtonGroup>
        </div >
        : history(LOGIN_ROUTE)}
    </div >
  )
})

export default Admin