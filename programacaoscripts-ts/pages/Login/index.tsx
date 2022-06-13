import React, { FC, useState } from 'react';
import {View, Text, TextInput, 
        TouchableOpacity, ScrollView, Alert, ActivityIndicator} from 'react-native';
import styles from './styles';
import { useAuth } from "../../hooks";
import { AuthProviderType } from '../../types'

const Login:FC<{ navigation:any }> = (props) => {
  const [mail, setMail] = useState<string>('ana@teste.com');
  const [password, setPassword] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { signIn, token } = useAuth() as AuthProviderType;

  function handleSign() {
    if( mail == '' ){
      Alert.alert("Forneça o e-mail");
    }
    else if( password == '' ) {
      Alert.alert("Forneça uma senha");
    }
    else {
      if (password.length < 6 || password.length > 10)
        Alert.alert("A senha precisa ter entre 6 e 10 caracteres") 
      else {
        setLoading(true);
        signIn(mail,password)
        .then((r: { error:string } | undefined) => {
          if( r !== undefined )
            Alert.alert(r.error)
        }).then(()=>setLoading(false));
      }
    }
  }

  return (
    !loading ? 
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>LOGIN</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              onChangeText={setMail}
              value={mail}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
          <View style={{marginTop:10}}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.boxButton}>
            <TouchableOpacity style={styles.button} onPress={handleSign}>
              <Text style={styles.buttonLabel}>logar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>props.navigation.navigate("Home")}>
              <Text style={styles.buttonLabel}>voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      :
      <Loading />
  );
}

const Loading = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);

export default Login