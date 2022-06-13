import React, { FC, useState } from 'react';
import {View, Text, TextInput, 
        TouchableOpacity, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { useAuth } from "../../hooks";
import { AuthProviderType } from '../../types'
import styles from './styles'

const Register:FC<any> = (props) => {
  const [mail, setMail] = useState<string>('ana@teste.com');
  const [password, setPassword] = useState<string>('123456');
  const [confirmation, setConfirmation] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);

  const { userCreate } = useAuth() as AuthProviderType;

  async function handleRegister() {
    if( mail == '' )
      Alert.alert("Forneça o e-mail");
    else if(password == '')
        Alert.alert("Forneça uma senha");
    else if(confirmation == '')
        Alert.alert("Confirme a senha");

    else{
      if ( password.length < 6 || password.length > 10 )
        Alert.alert("A senha precisa ter entre 6 e 10 caracteres")
      else if ( password !== confirmation )
        Alert.alert("A senha e a confirmação precisam ser iguais")

      else {
        setLoading(true);
        userCreate ? userCreate(mail,password) : null
        .then((r: { error:string } | undefined) => {
          if( r !== undefined )
            Alert.alert(r.error)
        })
        .finally(()=>setLoading(false));
      }
    }
  }

  return (
    !loading ? 
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRO</Text>
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
          <View style={{marginTop:10}}>
            <Text style={styles.label}>Confirmação da senha</Text>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmation}
              value={confirmation}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.boxButton}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonLabel}>cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>props.navigation.navigate('Home')}>
              <Text style={styles.buttonLabel}>voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      :
      <Loading />
  );
}

const Loading:FC = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);

export default Register