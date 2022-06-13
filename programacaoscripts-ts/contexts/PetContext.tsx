import React, { FC, useState, createContext } from 'react';
import * as auth from '../services/auth';
import { PetProviderType, PetType, PaymentType, MedicineType } from '../types'


const PetContext = createContext<PetProviderType>({} as PetProviderType);

const PetProvider:FC <{children: FC}> = ({ children }) => {
  const [pet,setPet] = useState<PetType>({} as PetType);

  async function petList():Promise<PetType> {
    return await auth.petList();
  }

  async function petCreate(name:string):Promise<PetType> {
    return await auth.petCreate(name);
  }

  async function petRemove(idpet:number):Promise<PetType> {
    return await auth.petRemove(idpet);
  }

  async function paymentCreate(idpet:number, description:string, value:number):Promise<PaymentType> {
    return await auth.paymentCreate(idpet, description, value);
  }

  async function paymentList(idpet:number):Promise<PaymentType> {
    return await auth.paymentList(idpet);
  }

  async function paymentRemove(idpayment:number):Promise<PaymentType> {
    return await auth.paymentRemove(idpayment);
  }

  async function medicineCreate(idpet:number, name:string):Promise<MedicineType> {
    return await auth.medicineCreate(idpet, name);
  }

  async function medicineList(idpet:number):Promise<MedicineType> {
    return await auth.medicineList(idpet);
  }

  async function medicineRemove(idmedicine:number):Promise<MedicineType> {
    return await auth.medicineRemove(idmedicine);
  }

  return (
    <PetContext.Provider value={{
      pet,setPet,
      petCreate, petList, petRemove,
      paymentCreate, paymentList, paymentRemove,
      medicineCreate, medicineList, medicineRemove
    }}>
      {children}
    </PetContext.Provider>
  );

}

export { PetContext, PetProvider };