import React, { FC,useState, useEffect, useContext } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import { usePet } from "../../hooks";
import { PaymentType, PetProviderType } from '../../types'
import styles from './styles';

const Payment:FC<any> = (props) => {
  const [register,setRegister] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { pet, paymentCreate, paymentList, paymentRemove } = usePet() as PetProviderType;
  const [list, setList] = useState<PaymentType[]>([]);

  useEffect(()=>{
    async function list(){
      setLoading(true);
      if( pet.idpet ){
        
        const response = paymentList ? await paymentList(pet.idpet) as {payments:any} : undefined;
        if( response && response.payments )
          setList(response.payments);
        
      }
      setLoading(false);
    }
    list();
  },[pet]);
  //pet,paymentList

  const add:(description: string, value: number) => Promise<void> = async (description,value) => {
    if( description && value ){
      setLoading(true);
      if (pet.idpet) {
        const response = paymentCreate ? await paymentCreate(pet.idpet,description,value) as PaymentType : undefined;
        if (response)
          if( response.idpayment ){
            const aux:PaymentType[] = [...list, response];
            setList(aux);
            setRegister(false);
          }
          else
            Alert.alert(response.error || "Problemas para cadastrar o pagamento");
        else
          Alert.alert("Problemas para cadastrar o pagamento");
      }
      else
        Alert.alert("Forneça a descrição e valor do gasto");
      setLoading(false);
    }
    else {
      Alert.alert("Problemas para cadastrar o pagamento");
    }
      
  };

const remove:(idpayment: number, description: string) => Promise<void> = async (idpayment,description) => {
    Alert.alert(
      '',
      `Excluir definitivamente o pagamento ${description}?`,
      [
        {
          text: "Sim",
          onPress: async () => {
            setLoading(true);
            const response = paymentRemove ? await paymentRemove(idpayment) as PaymentType : undefined;
            if(response)
              if( response.idpayment ){
                const aux:PaymentType[] = [...list];
                for(let i = 0; i < aux.length; i++){
                  if( aux[i].idpayment == idpayment ){
                    aux.splice(i,1);
                    setList(aux);
                    break;
                  }
                }
              }
              else
                Alert.alert(response.error || "Problemas para excluir o pagamento");
            else
              Alert.alert("Problemas para excluir o pagamento");
            setLoading(false);
          },
        },
        {
          text: "Não",
        }
      ]);
  };

  const renderItem:FC<{item:PaymentType}> = ({ item }) => {
    const dateAux:string[] = item.date ? item.date.split('-') : ['','',''];
    const date:string = `${dateAux[2]}/${dateAux[1]}/${dateAux[0]}`;
    return (
      <View style={styles.item}>
        <View style={styles.itemtext}>
          <Text style={styles.itemname}>{item.description}</Text>
          <Text style={styles.itemname}>R${item.value} - {date}</Text>
        </View>
        <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idpayment as number,item.description as string)}>
          <MaterialCommunityIcons name='delete' color="#555" size={25} />
        </TouchableOpacity>
      </View>
    );
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
        <ScrollView style={[styles.scroll,{flexGrow:1}]}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item:PaymentType) => (item.idpayment as number).toString()}
          />
        </ScrollView>
        :
        <Empty message="Clique no botão para cadastrar um pagamento" />
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
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<string>('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR GASTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            autoCapitalize="words"
          />
        </View>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            onChangeText={setValue}
            value={value}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity style={styles.button} onPress={()=>props.add(description.trim(),value.trim())}>
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

export default Payment