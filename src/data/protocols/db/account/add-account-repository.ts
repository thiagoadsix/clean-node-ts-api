import {
  AccountModel,
  AddAccountModel
} from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
