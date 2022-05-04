import {
  AccountModel,
  AddAccountParams
} from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
