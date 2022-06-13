//User
export interface AuthType {
  token?: string,
  mail?: string,
  password?: string,
  error?:string
}

export interface AuthProviderType {
  signIn: Function,
  signOut?: Function,
  userCreate?: Function,
  token: string | null,
  mail?: string | null,
  loading: boolean
}

// Pet
export interface PetType {
  idpet?: number,
  name?: string,
  error?: string
}

export interface PaymentType {
  idpayment?: number,
  idpet?: number,
  date?: string,
  description?: string,
  value?: number,
  error?: string
}

export interface MedicineType {
  idmedicine?: number,
  idpet?: number,
  name?: string,
  date?:string,
  error?: string
}

export interface PetProviderType {
  pet: PetType,
  setPet?: React.Dispatch<React.SetStateAction<PetType>>,

  petCreate?: Function,
  petList?: Function,
  petRemove?: Function,

  paymentCreate?: Function,
  paymentList?: Function,
  paymentRemove?: Function,

  medicineCreate?: Function,
  medicineList?: Function,
  medicineRemove?: Function
}

//Others
export interface ErrorType {
  error?: string
}