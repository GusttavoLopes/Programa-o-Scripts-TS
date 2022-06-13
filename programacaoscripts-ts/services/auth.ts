import api from './api';
import { PetType } from '../types'

async function signIn(mail:string, password:string):Promise<object> {
  try{
    const {data} = await api.post("/user/login", { mail, password });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function userCreate(mail:string, password:string):Promise<object> {
  try{
    const {data}:any = await api.post("/user/create", { mail, password });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function petList():Promise<object> {
  try{
    const {data}:any = await api.get("/pet/list");
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function petCreate(name:string):Promise<PetType> {
  try{
    const {data}:any = await api.post("/pet/create", { name });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function petRemove(idpet:number):Promise<object> {
  try{
    const {data}:any = await api.delete("/pet/remove", { data: {idpet} });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function paymentCreate(idpet:number, description:string, value:number):Promise<object> {
  try{
    const {data}:any = await api.post("/payment/create", { idpet, description, value });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function paymentList(idpet:number):Promise<object> {
  try{
    const {data}:any = await api.post("/payment/list", {idpet});
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function paymentRemove(idpayment:number):Promise<object> {
  try{
    const {data}:any = await api.delete("/payment/remove", { data: {idpayment} });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function medicineCreate(idpet:number, name:string):Promise<object> {
  try{
    const {data}:any = await api.post("/medicine/create", { idpet, name });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function medicineList(idpet:number):Promise<object> {
  try{
    const {data}:any = await api.post("/medicine/list", {idpet});
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

async function medicineRemove(idmedicine:number):Promise<object> {
  try{
    const {data}:any = await api.delete("/medicine/remove", { data: {idmedicine} });
    return data;
  }
  catch(e){
    return {error: e.message as string};
  }
}

export {
  signIn,
  userCreate,
  petList,
  petCreate,
  petRemove,
  paymentCreate,
  paymentList,
  paymentRemove,
  medicineCreate,
  medicineList,
  medicineRemove
};