import React, { FC } from 'react';
import { View, ActivityIndicator } from "react-native";
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import {useAuth} from '../hooks';
import { AuthProviderType } from '../types'

const Routes:FC = () => {
  const { token, loading } = useAuth() as AuthProviderType;

  if (loading) {
    return <Loading />;
  }

  return !token ? <AuthRoutes /> : <AppRoutes />;
}

const Loading:FC = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);

export default Routes