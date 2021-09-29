import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    name: yup.string().required('name is required'),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

const categorySchema = { create }

export default categorySchema
