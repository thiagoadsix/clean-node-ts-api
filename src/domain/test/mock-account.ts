import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

const mockAccountResponse = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@example.com',
  password: 'any_hashed_password'
})

const mockAccountRequest = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@example.com',
  password: 'any_password'
})

export { mockAccountResponse, mockAccountRequest }
