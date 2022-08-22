import { Form, Button } from "react-bootstrap"

const User = () => {
  return (
    <div className="d-flex">
      <Form className="p-3 d-flex" style={{ minWidth: 450, rowGap: 14, flexDirection: "column" }}>
        <h4>Создание коллекции</h4>
        <Form.Group>
          <Form.Label>Название коллекции</Form.Label>
          <Form.Control type="text" placeholder="Введите название коллекции" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Описание коллекции</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <Form.Group >
          <Form.Label>Тема коллекции</Form.Label>
          <Form.Select>
            <option>Книги</option>
            <option>Фильмы</option>
            <option>Автомобили</option>
          </Form.Select>
        </Form.Group>
        <Button>Создать коллекцию</Button>
      </Form>
      <div className="p-3">
        <h4>Список коллекций</h4>
      </div>
    </div >
  )
}

export default User