import React,{useState,useEffect} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    Dimensions
} from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth,db,storage} from '../../firebase/config';
import {set,push,child,update,ref} from 'firebase/database';
import {onSnapshot,collection } from '@firebase/firestore';
import {getMetadata,getDownloadURL,uploadBytesResumable } from "firebase/storage";
const {width,height} = Dimensions.get('screen');
const TestFirebase = ()=>{
    const [mount,setMount] = useState(false);
    const [uri,setUri] = useState('https://binhphuoc.gov.vn/uploads/binhphuoc/news/2022_01/2022-01-12_vn-nghi-tet-al-9d_02_h84_1.jpg');
    //const starCountRef = ref(db, 'posts/starCount');
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //const storageRef = ref(storage, 'AnhDaiDien2.jpg');
    const getImageFromFirebaseStorage = ()=>{
        // getDownloadURL(storageRef).then((downloadURL) => {
        //     setUri(downloadURL);
        //     console.log(downloadURL);
        // });
    }
   
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const showImage = ()=>{

    }
    const PushImageToFirebase = (source)=>{
        //YcczMM6l2kdP7VWB1yWJLHKJLEz2
        const updates = {};
        updates['/users/YcczMM6l2kdP7VWB1yWJLHKJLEz2/Avatar/'] = uri;
        console.log('Pushed');
        return update(ref(db),updates);  
    }
    const getImageFromCamera= ()=>{
        const options={
            storageOptions: {
                path: 'images',
                mediaType:'photo',
            },
            includeBase64:true,
        };

        launchCamera(options,response=>{
            if(response.didCancel)
            {
                console.log('User cancelled image picker');
            } 
            else if(response.error)
            {   
                console.log('Image picker error: ' + response.error);
            }
            else if(response.customButton)
            {
                console.log('Image picker custom button'+ response.customButton);
            }
            else
            {
                const source = {uri:'data:image/jpeg;base64,' + response.base64};
                setUri(source)
            }
        });
    }
    const getImageFromLibrary= ()=>{
        const options={
            storageOptions: {
                path:'images', 
                mediaType:'photo',
            },
            includeBase64:true,
        };

        launchImageLibrary(options,response=>{
            if(response.didCancel)
            {
                console.log('User cancelled image picker');
            } 
            else if(response.error)
            {   
                console.log('Image picker error: ' + response.error);
            }
            else if(response.customButton)
            {
                console.log('Image picker custom button'+ response.customButton);
            }
            else
            {
                var result = response.assets;
                const source = 'data:'+result[0].type+';base64,' + result[0].base64;
                console.log(source);
                setUri(source);
            }
        });
    }
    //const result = await launchImageLibrary(mediaType);    
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    return(
        <SafeAreaView>
            <View>
                <Text style={text().title_center}>Firebase</Text>
            </View>
            <Button
                title={'Get Image From Firebase'}
                color="#333"
                onPress={getImageFromFirebaseStorage}
            />
            <Button
                title={'Upload from Camera'}
                color="#333"
                onPress={getImageFromCamera}
            />
            <Button
                title="Get Image From Library"
                color="#333"
                onPress={getImageFromLibrary}
            />
            <Button
                title="Push Image to Firebase"
                color="#333"
                onPress={PushImageToFirebase}
            />
            <Text>{
                mount == true ?"True":""
            }</Text>
            <Image
                style={{width:width, height:width}}
                source={{uri}}
            />
        </SafeAreaView>
    )
}
const text = ()=>StyleSheet.create({})
export default TestFirebase