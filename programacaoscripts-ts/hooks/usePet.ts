import { useContext } from 'react';
import { PetContext } from '../contexts'
import { PetProviderType } from '../types'

export default function usePet():PetProviderType {
  const context = useContext<PetProviderType>(PetContext);

  if (!context) {
    throw new Error('hook usePet está sendo chamado fora do PetProvider');
  }

  return context;
}