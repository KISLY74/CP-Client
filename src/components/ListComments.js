import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Button, Badge, Spinner } from "react-bootstrap"
import { Context } from "../index"
import { getComments } from "../http/itemApi"
import { getDataAccess } from "../http/itemApi"

const ListComments = observer((props) => {
  const { item } = useContext(Context)
  const [comments, setComments] = useState()
  const [loading, setLoading] = useState(true)
  const [isShow, setIsShow] = useState(false)
  const [isAccess, setIsAccess] = useState(true)
  const getCommentsByItem = async () => {
    setLoading(false)
    await getComments(props.itemId).then((data) => setComments(data)).finally(() => setLoading(true))
  }
  const handlerChangeStateComments = () => {
    if (isShow) {
      setIsShow(false)
    } else {
      setIsShow(true)
      item.setCommentsLoad(true)
    }
  }
  const getDataAccessItem = async (id) => {
    await getDataAccess(id).then((data) => setIsAccess(data))
  }
  useEffect(() => {
    getDataAccessItem(props.itemId)
    getCommentsByItem()
  }, [item.commentsLoad])
  return (
    <div>
      {isAccess ?
        <div>
          <Button variant="secondary" onClick={() => handlerChangeStateComments()}>
            {isShow ? "Скрыть комментарии" : "Показать комментарии"} <Badge bg="danger">{comments ? comments.length : false}</Badge>
          </Button>
          {item.commentsLoad ?
            <div>
              {isShow ? <div style={{ maxHeight: 150, overflow: "scroll", overflowX: "hidden" }}>
                {loading ? comments ? comments.map((e) => {
                  return <div className="text-light border p-3 mt-2">
                    <h6><Badge>Автор:</Badge> {e.author}</h6>
                    <h6><Badge>Комментарий:</Badge> {e.comment}</h6>
                    <h6><Badge>Дата добавления:</Badge> {e.dateAddition}</h6>
                  </div>
                }) : false : <Spinner animation="border" variant="light" />}
              </div> : false}
            </div> : false}
        </div> : <p className="text-danger">Пользователь закрыл доступ к комментариям</p>}
    </div>)
})

export default ListComments