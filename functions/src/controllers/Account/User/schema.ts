import * as yup from 'yup'

const createPassword = yup
  .object()
  .shape({
    newPassword: yup
      .string()
      .min(8, 'at least 8 characters')
      .oneOf([yup.ref('confirmNewPassword')], 'passwords are not the same'),
    confirmNewPassword: yup
      .string()
      .min(8, 'at least 8 characters')
      .oneOf([yup.ref('newPassword')], 'passwords are not the same'),
  })
  .required()

const create = yup
  .object()
  .shape({
    fullName: yup.string().required('full name is required'),
    email: yup.string().email('invalid email').required('email is required'),
    phone: yup.string().nullable(),
    picturePath: yup.string().nullable(),
    role: yup.string().required('role is required'),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

const register = yup
  .object()
  .shape({
    email: yup.string().email('invalid email').required('email is required'),
    ...createPassword.fields,
  })
  .required()

const login = yup
  .object()
  .shape({
    email: yup.string().email('invalid email').required('email is required'),
    password: yup.string().required('password is required'),
  })
  .required()

const userSchema = { createPassword, create, register, login }

export default userSchema
