import { Table, Form } from "react-bootstrap"
import { useEffect, useState } from "react"
import { getUsers } from "../http/userApi"
import { LOGIN_ROUTE } from "../utils/routes"
import { useNavigate } from "react-router-dom"

const Admin = () => {
  const history = useNavigate()
  const [users, setUsers] = useState([])
  const [usersValues, setUsersValues] = useState([])
  const [headers, setHeaders] = useState([])
  const updateTableUsers = async () => {
    try {
      await getUsers().then((data) => {
        setUsers(data.data)
        setUsersValues(data.data.map(e => Object.values(e)))
        setHeaders(Object.keys(data.data[0]))
      })
    } catch (e) {
      console.log(e)
    }
    return users
  }
  useEffect(() => {
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
  return (
    <div className="p-4">
      <h1>Пользователи</h1>
      <Table bordered hover>
        <thead>
          <tr>
            <th><Form.Check className="checkbox-all" onClick={() => handleClickCheckboxAll()} />Выделить/Снять всё</th>
            {headers ? headers.map((e, i) => (i !== 2 && i !== 0) ? <th>{`${e}`}</th> : "") : ""}
          </tr>
        </thead>
        <tbody>
          {usersValues ? usersValues.map((el, ind) => el ? <tr key={ind}><td><Form.Check onClick={() => handleClickCheckbox()} className="checkbox" key={ind} /></td>{el.map((e, i) => {
            if (i !== 2 && i !== 0) return <td key={i}>{`${e}`}</td>
          })}</tr> : '') : ''}
        </tbody>
      </Table>
    </div>
  )
}

export default Admin