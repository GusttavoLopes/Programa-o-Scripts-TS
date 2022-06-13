import React, {FC, useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import styles from './styles';
import { useAuth, usePet, useBackHandler } from "../../hooks";
import { AuthType, AuthProviderType, PetType, PetProviderType } from '../../types'


const Pet:FC<{ navigation: any }> = (props) => {
  const [selected,setSelected] = useState<number>();
  const [register,setRegister] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { pet, setPet, petList, petCreate, petRemove } = usePet();
  
  const { signOut, token } = useAuth() as AuthProviderType;
  const [list, setList] = useState<PetType[]>([]);

  useEffect(()=>{
    async function list():Promise<void> {
      setLoading(true);
      const response = petList ? await petList() as {pets:PetType[]} : undefined;
      if (response) 
        if( response.pets ){
          setList(response.pets);
          if( response.pets.length > 0 ){
            setSelected(response.pets[0].idpet);
            setPet ? setPet(response.pets[0]) : null;
          }
        }
      else
        Alert.alert('Problemas ao obter os pets.')
      setLoading(false);
    }
    list();
  },[]);

  useBackHandler(() => {
    if( props.navigation.isFocused() ){
      exit();
    }
    else{
      props.navigation.goBack();
    }
    return true;
  });

  const exit:() => void = () => {
    Alert.alert('', "Deseja encerrar o aplicativo?", [
        { text: "sim", onPress: () => signOut ? signOut() : null },
        {text: "não",onPress: () => null, style: 'cancel'}
      ]);
  };

  const add:(name:string) => Promise<void> = async (name) => {
    if( name ){
      setLoading(true);
      const response = petCreate ? await petCreate(name) as PetType : undefined;
      if (response)
        if( response.idpet ){
          const aux:PetType[] = [...list, response];
          setList(aux);
          setSelected(response.idpet);
          setPet ? setPet(response) : null;
          setRegister(false);
        }
        else
          Alert.alert(response.error || "Problemas para cadastrar o pet");
      else
        Alert.alert("Problemas para cadastrar o pet");
      setLoading(false);
    }
    else
      Alert.alert("Forneça o nome do pet");
  };

  const remove:(idpet:number,name:string) => Promise<void> = async (idpet, name) => {
    Alert.alert(
      '',
      `Excluir definitivamente o pet ${name}?`,
      [
        {
          text: "Sim",
          onPress: async () => {
            setLoading(true);
            const response = petRemove ? await petRemove(idpet) as PetType : undefined;
            if (response)
              if( response.idpet ){
                const aux:PetType[] = [...list];
                for(let i = 0; i < aux.length; i++){
                  if( aux[i].idpet == idpet ){
                    aux.splice(i,1);
                    setList(aux);
                    if( idpet == selected && aux.length > 0 ){  
                      setSelected(aux[0].idpet);
                      setPet ? setPet(aux[0]) : null;
                    }
                    else if( idpet == selected && aux.length == 0 )
                      setPet ? setPet({}) : null;
                    break;
                  }
                }
              }
              else
                Alert.alert(response.error || "Problemas para excluir o pet");
            else
              Alert.alert("Problemas para excluir o pet");
            setLoading(false);
          },
        },
        {
          text: "Não",
        }
      ]);
  };

  const RenderItem:FC<{item:PetType}> = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity style={styles.itemtext} onPress={()=> {
        setSelected(item.idpet); 
        setPet ? setPet(item) : null
      }}>
        <Text style={[styles.itemname,selected == item.idpet &&{fontWeight:'bold'}]}>{item.name}</Text>
        { selected == item.idpet &&
          <Entypo name="check" color="#555" size={25} style={styles.itemcheck} />
        }
      </TouchableOpacity>
      <TouchableOpacity style={styles.remove} onPress={() => remove(item.idpet as number, item.name as string)}>
        <MaterialCommunityIcons name='delete' color="#555" size={25} />
      </TouchableOpacity>
    </View>
  );

  return (
    loading ? 
      <Loading />
    :
    register ?
      <Register setRegister={setRegister} add={add} />
    :
    <View style={styles.container}>
      {
        list.length > 0 ?
        <ScrollView style={styles.scroll}>
          <FlatList
            data={list}
            renderItem={(item:PetType) => <RenderItem item={item}/>}
            keyExtractor={(item:PetType) => (item.idpet as number).toString()}
          />
        </ScrollView>
        :
        <Empty message='Clique no botão para cadastrar o seu pet' />
      }
      <FAB
        style={styles.add}
        small
        color="white"
        icon="plus"
        onPress={() => setRegister(true)}
      />
      <FAB
        style={styles.exit}
        small
        color="white"
        icon="exit-to-app"
        onPress={() => exit()}
      />
    </View>   
  );
}

const Empty:FC<{message:string}> = (props) => (
  <View style={styles.msg}>
    <Text style={styles.msgtext}>
      {props.message}
    </Text>
  </View>
);

const Register:FC<{ add: Function, setRegister: Function }> = (props) => {
  const [name, setName] = useState<string>('');
  
  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR PET</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Nome do pet</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity style={styles.button} onPress={()=>props.add(name.trim())}>
            <Text style={styles.buttonLabel}>salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>props.setRegister(false)}>
            <Text style={styles.buttonLabel}>voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Loading:FC = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);

export default Pet