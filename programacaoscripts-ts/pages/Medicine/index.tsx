import React, { FC, useState, useContext, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import { usePet } from "../../hooks";
import { MedicineType, PetProviderType, ErrorType } from '../../types'
import styles from './styles';


const Medicine:FC<any> = (props) => {
  //const [id,setId] = useState('');
  const [register,setRegister] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const { pet, medicineCreate, medicineList, medicineRemove } = usePet() as PetProviderType;

  const [list, setList] = useState<MedicineType[]>([]);

  useEffect(() => {
    async function list(){
      if( pet.idpet ){
        setLoading(true);
        const response = medicineList ? await medicineList(pet.idpet) as {medicines:any} : undefined;
        if( response && response.medicines )
          setList(response.medicines);
        setLoading(false);
      }
    }
    list();
  },[pet])


  const add:(name:string) => Promise<void> = async (name) => {
    if(name && pet.idpet) {
      setLoading(true);
      const response = medicineCreate ? await medicineCreate(pet.idpet, name) as MedicineType : undefined;
      if (response)
        if(response.idmedicine) {
          const aux = [...list,response]
          setList(aux);
          setRegister(false);
        }
        else 
          Alert.alert(response.error || "Problemas para cadastrar o medicamento");
      else 
        Alert.alert("Problemas para cadastrar o medicamento");
      setLoading(false);
    }
    else
      Alert.alert("Forneça o nome do medicamento");
  };
  

  const remove:(idmedicine:number,name:string) => Promise<void> = async (idmedicine, name) => {
    Alert.alert(
      '',
      `Excluir definitivamente o medicamento ${name}?`,
      [
        {
          text: "Sim",
          onPress: async () => {
            setLoading(true);
            const response = medicineRemove ? await medicineRemove(idmedicine) as MedicineType : undefined;
            if(response)
            if( response.idmedicine ){
              const aux:MedicineType[] = [...list];
              for(let i = 0; i < aux.length; i++){
                if( aux[i].idmedicine == idmedicine ){
                  aux.splice(i,1);
                  setList(aux);
                  break;
                }
              }
            }
              else
                Alert.alert(response.error || "Problemas para excluir o medicamento");
            else
              Alert.alert("Problemas para excluir o medicamento");
            setLoading(false);
          },
        },
        {
          text: "Não",
        }
      ]);
  }

  const renderItem:FC<{item:MedicineType}> = ({ item }) => {
    const dateAux:string[] = item.date ? item.date.split('-') : ['','',''];
    const date:string = `${dateAux[2]}/${dateAux[1]}/${dateAux[0]}`;
    return (
      <View style={styles.item}>
        <View style={styles.itemtext}>
          <Text style={styles.itemname}>{item.name}</Text>
          <Text style={styles.itemname}>{date}</Text>
        </View>
        <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idmedicine as number,item.name as string)}>
          <MaterialCommunityIcons name='delete' color="#555" size={25} />
        </TouchableOpacity>
      </View>
    )
  };

  return (
    loading ?
      <Loading />
    :
    register ?
      <Register setRegister={setRegister} add={add} />
    : 
    pet.name ? 
    (
      <View style={styles.container}>
        <View style={styles.titlebox}>
          <Text style={styles.titletext}>{pet.name}</Text>
        </View>
        {
          list.length > 0 ?
          (
          <ScrollView style={styles.scroll}>
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={(item:MedicineType) => (item.idmedicine as number).toString()}
            />
          </ScrollView>
          )
          :
          <View style={styles.container}>
            <Empty message="Cadastre um pet na aba Pet" />
          </View>
        }
        <FAB
          style={styles.add}
          small
          color="white"
          icon="plus"
          onPress={() => setRegister(true)}
        />
      </View>
    )
    :
    <View style={styles.container}>
      <Empty message="Cadastre um pet na aba Pet" />
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



const Register:FC<{add:Function,setRegister:Function}> = (props) => {
  const [name, setName] = useState<string>('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR MEDICAMENTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Nome do medicamento</Text>
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

export default Medicine