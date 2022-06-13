import {useContext} from 'react';
import {AuthContext} from '../contexts';
import { AuthType } from '../contexts'

export default function useAuth():AuthType {
  const context = useContext<AuthType>(AuthContext);

  if (!context) {
    throw new Error('hook useAuth está sendo chamado fora do AuthProvider');
  }

  return context;
}