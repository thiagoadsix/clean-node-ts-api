export interface HashComparer {
  compare: (value: string, password: string) => Promise<boolean>
}
