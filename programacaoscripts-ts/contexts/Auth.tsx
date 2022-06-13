import React, { FC, useState, useEffect, createContext, useContext } from "react";
import * as auth from '../services/auth';
import api from "../services/api";
import * as SecureStore from 'expo-secure-store';
import { AuthType, ErrorType, AuthProviderType } from '../types'


const AuthContext = createContext<AuthProviderType>({} as AuthProviderType);

const AuthProvider:FC<{children:FC}> = ({ children }) => {
  const [token,setToken] = useState<string | null>(null);
  const [mail,setMail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStorageData():Promise<void> {
      const storagedToken:string | null = await SecureStore.getItemAsync('token');
      const storagedMail:string | null = await SecureStore.getItemAsync('mail');
      
      if (storagedToken && storagedMail) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}` ;
        setMail(storagedMail);
        setToken(storagedToken);
      }
      setLoading(false);
    }

    loadStorageData();
  },[]);

  async function signIn(mail:string, password:string):Promise<ErrorType|undefined> {
    const response: AuthType = await auth.signIn(mail,password);
    
    if( response.token && response.mail ){
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      await SecureStore.setItemAsync('token', response.token);
      await SecureStore.setItemAsync('mail', response.mail);
      setToken(response.token);
      setMail(response.mail);
    }
    else{
      return {error: response.error || "Problemas ao executar a operação"};
    }
  }

  async function signOut():Promise<void> {
    api.defaults.headers.common['Authorization'] = '';
    setToken(null);
    setMail(null);
    SecureStore.deleteItemAsync('token');
    SecureStore.deleteItemAsync('mail');
  }

  async function userCreate(mail:string, password:string):Promise<ErrorType|undefined> {
    const response: AuthType = await auth.userCreate(mail,password);
    if( response.token && response.mail ){
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      await SecureStore.setItemAsync('token', response.token);
      await SecureStore.setItemAsync('mail', response.mail);
      setToken(response.token);
      setMail(response.mail);
    }
    else{
      return {error: response.error || "Problemas ao executar a operação"};
    }
  }

  return (
    <AuthContext.Provider value={{ 
      signIn, signOut, userCreate, token, mail, loading
      }}
    >
      { children }
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};