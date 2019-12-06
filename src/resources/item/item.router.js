import { Router } from 'express'
import {
  getAllItems,
  getOneItem,
  createOneItem,
  updateOneItem,
  deleteOneItem
} from './item.controllers'

const router = Router()

router
  .route('/')
  .get(getAllItems)
  .post(createOneItem)

router
  .route('/:id')
  .get(getOneItem)
  .put(updateOneItem)
  .delete(deleteOneItem)

export default router
