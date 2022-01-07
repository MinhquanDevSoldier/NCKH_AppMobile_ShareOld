import React,{useState,useEffect} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Button,
} from 'react-native'
import {text} from '../styles/text'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth,db} from '../firebase/config'
import {set,ref,push,child,update} from 'firebase/database'
import { onSnapshot,collection } from '@firebase/firestore';

const TestFirebase = ()=>{
    const [mount,setMount] = useState(false);

    const onPressToogle = () => {
        var datetime = new Date();
        var date = datetime.toLocaleDateString('en-GB');
        var time = datetime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

        const postData = {
            date,time
        }
        const newPostKey = push(child(ref(db), 'posts')).key;
        const updates = {};
        updates['/posts/' + newPostKey] = postData;
        updates['/user-posts/' + newPostKey] = postData;
        console.log(updates);
        //return update(ref(db), updates);
    }
    const onPressRegister = () => {
        createUserWithEmailAndPassword(auth,"minhquangalaxys@gmail.com","123123")
        .then((userCredential)=>{
            alert(userCredential.user.email);
        })
        .catch((err) => {alert(err);})
    }
    return(
        <SafeAreaView>
            <View>
                <Text style={text().title_center}>Firebase</Text>
            </View>
            <Button
                title={a}
                color="#841584"
                onPress={onPressToogle}
            />
            <Button
                title="Register"
                color="#333"
                onPress={onPressRegister}
            />
            <Text>{
                mount == true ?"True":""
            }</Text>
        </SafeAreaView>
    )
}

export default TestFirebase