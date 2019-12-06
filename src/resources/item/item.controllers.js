export const createOneItem = (req, res) => {
  res.send({ message: 'Item Created' })
}
export const getAllItems = (req, res) => {
  res.send({ message: 'Get All Items' })
}
export const getOneItem = (req, res) => {
  res.send({ message: `Got One Item with id: '${req.params.id}'` })
}
export const updateOneItem = (req, res) => {
  res.send({ message: `Item with id '${req.params.id}' Updated` })
}
export const deleteOneItem = (req, res) => {
  res.send({ message: `Item with id '${req.params.id}' Deleted` })
}

export default {
  createOneItem,
  getAllItems,
  getOneItem,
  updateOneItem,
  deleteOneItem
}
