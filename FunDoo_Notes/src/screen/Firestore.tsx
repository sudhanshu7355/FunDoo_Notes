import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';


const FireStore = () => {
  const [mydata, setMyData] = useState(null); 
  useEffect(()=>{
    getData()
  },[])

  const getData= async()=>{
    const data = await firestore().collection('users').doc('H7yx0KJ6IcY8xCZrxnU2').get();
    console.log(data._data);
    setMyData(data._data)
  }
  return (
    <View>
      <Text>App</Text>
      <Text>Name : {mydata ? mydata.name : "Loading...."  }</Text>
      <Text>Age : {mydata ? mydata.age : "Loading...." }</Text>
      <Text>Hobbies : {mydata ? mydata.Hobbies.map((list)=>`  ${list}`) : "Loading...." }</Text>
    </View>
  )
}


const styles = StyleSheet.create({

});
export default FireStore;