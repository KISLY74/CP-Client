import { Table } from "react-bootstrap"
import { useEffect, useState } from "react"
import { getUsers } from "../http/userApi"

const Admin = () => {
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
  return (
    <div className="p-4">
      <h1>Пользователи</h1>
      <Table bordered hover>
        <thead>
          <tr>
            {headers ? headers.map((e, i) => (i !== 2 && i !== 0) ? <th>{`${e}`}</th> : "") : ""}
          </tr>
        </thead>
        <tbody>
          {usersValues ? usersValues.map((el, ind) => el ? <tr key={ind}>{el.map((e, i) => {
            if (i !== 2 && i !== 0) return <td key={i}>{`${e}`}</td>
          })}</tr> : '') : ''}
        </tbody>
      </Table>
    </div>
  )
}

export default Admin