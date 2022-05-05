import { AuthenticationParams } from '@/domain/usecases/account/authentication'

const mockAuthenticationRequest = (): AuthenticationParams => ({
  email: 'email@example.com',
  password: 'password'
})

export { mockAuthenticationRequest }
