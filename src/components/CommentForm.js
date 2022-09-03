import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import { Form, Button, Image } from "react-bootstrap"
import { Context } from "../index"
import { addComment } from "../http/itemApi"
import { getDataAccess } from "../http/itemApi"
const comment = require('../assets/comment.png')

const CommentForm = observer((props) => {
  const { item } = useContext(Context)
  const [commentText, setCommentText] = useState('')
  const [isAccess, setIsAccess] = useState(true)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const sendComment = async () => {
    item.setCommentsLoad(false)
    let comment = { author: localStorage.getItem('username'), comment: commentText, dateAddition: new Date(Date.now()) }
    await addComment(props.itemId, comment).finally(() => item.setCommentsLoad(true))
    setShowCommentForm(false)
  }
  const handleClickShowCommentForm = () => {
    showCommentForm ? setShowCommentForm(false) : setShowCommentForm(true)
  }
  const getDataAccessItem = async (id) => {
    await getDataAccess(id).then((data) => setIsAccess(data))
  }
  useEffect(() => {
    getDataAccessItem(props.itemId)
  }, [])
  return <Form>
    {isAccess ?
      <Image className="mt-2" src={comment} style={{ width: 35, cursor: "pointer" }} onClick={() => handleClickShowCommentForm()} /> : false}
    {showCommentForm ? <Form.Group>
      <Form.Control className="mt-2" as="textarea" rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Комментарий"></Form.Control>
      <Button className="mt-2" onClick={() => sendComment()}>Отправить</Button>
    </Form.Group> : false}
  </Form>
})
export default CommentForm