import React,{useState,useEffect} from 'react';
import { 
    SafeAreaView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ImageBackground,
    ScrollView
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import NormalAlert from '../../components/modals/NormalAlert';
import { auth,db } from '../../firebase/config';
import { createUserWithEmailAndPassword,updateProfile,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { set,ref } from 'firebase/database';
const {width,height} = Dimensions.get('window');     

const RegisterScreen = ({navigation})=>{
    //Variables
    const [email,onChangeEmail] = useState("");
    const [password,onChangePassword] = useState("");
    const [inputName,onChangeInputName] = useState('');
    const [inputAddress,onChangeAddress] = useState('');
    const [inputPhone,onChangePhone] = useState('');
    const [message,setMessage] = useState('');
    const [avatar,setAvatar] = useState('https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png');
    const [disabled,setdisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    //Functions
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
                //console.log(source);
                setAvatar(source);
            }
        });
    }

    const CreateAccount = ()=>{
        createUserWithEmailAndPassword(auth,email, password)
        .then((userCredential)=>{
            updateProfile(auth.currentUser, {
                displayName: inputName, 
                photoURL: avatar
              }).then(() => {
                var date = new Date().getDate(); //Current Date
                var month = new Date().getMonth() + 1; //Current Month
                var year = new Date().getFullYear(); //Current Year
                var hours = new Date().getHours(); //Current Hours
                var min = new Date().getMinutes(); //Current Minutes
                var sec = new Date().getSeconds();
                set(ref(db, 'users/' + userCredential.user.uid), {
                    Avatar:avatar,
                    username: inputName,
                    email: email,
                    Address: inputAddress,
                    Phone: inputPhone,
                    CreateAt: `${date}/${month}/${year}`
                  });
              }).catch((error) => {
                console.log(error.message);
              });
        })
        .catch((error)=>{ console.log(error.message)})
    }

    const VerifyInfoAccount = ()=>{
        if(password.length < 6)
        {
            setMessage('M???t kh???u ph???i c?? ??t nh???t 6 k?? t???');
        }
        else if(inputName == '')
        {
            setMessage('H??y cho ch??ng t??i v?? m???i ng?????i bi???t n??n g???i b???n l?? g?? ? ( Ch??a nh???p t??n )');
        }
        else if(inputAddress == '')
        {
            setMessage('Nh?? b???n ??? ????u th??? ? ( Ch??a ?????a ch??? )');
        }
        else if(inputPhone == '')
        {
            setMessage('Ch??a nh???p s??? ??i???n tho???i');
        }
        else {
            setMessage('????ng k?? th??nh c??ng\n ????ng nh???p ngay');
            CreateAccount();
        }
        setModalVisible(!modalVisible);
    }
    return(
        <SafeAreaView style={styles().container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <ImageBackground
                style={{width:width,opacity:1,paddingHorizontal:0}}
                resizeMode='cover'
                source={require('../../assets/images/connectPeople.png')}
            > 
            <View style={styles().Header}>
                <Text
                    style={{fontWeight:"800",color:'#2596be',fontSize:26}}
                >????ng k??</Text>
                <Text style={{fontWeight:"600",fontSize:16}}>??i???n ?????y ????? c??c th??ng tin nh??</Text>
            </View>
            <View style={styles().Body}>
                
                <View
                    style={{alignItems:'center'}}
                >
                    <Image
                        style={{width:width/1.3, height:width/1.3,borderRadius:15}}
                        source={{uri:avatar}}
                    />
                    <TouchableOpacity
                        style={{
                            marginBottom:10,
                            borderRadius:5,
                            //paddingHorizontal:20,
                            paddingVertical:10,
                            marginTop:10,
                            alignItems: "center",
                            width:width/2-10,
                            //marginHorizontal:5,
                            backgroundColor:'#3b8ba5',
                        }}
                        onPress={getImageFromLibrary}
                    >
                        <Text style={{color:'#ffff',fontWeight:'700',textAlign:'center'}}>Th?? vi???n ???nh</Text>
                    </TouchableOpacity> 
                </View>
                 
                <TextInput
                    style={styles().TextInput}
                    onChangeText={onChangeEmail}
                    placeholder="T??n ????ng nh???p (S??? ??i???n tho???i)"
                />
                <TextInput
                    style={styles().TextInput}
                    onChangeText = {onChangePassword}
                    //secureTextEntry={password == "" ? false : true}
                    placeholder="Nh???p m???t kh???u"
                />
                <TextInput
                    style={styles().TextInput}
                    onChangeText = {onChangeInputName}
                    placeholder="B???n t??n g?? ?"
                />
                <TextInput
                    style={styles().TextInput}
                    onChangeText = {onChangeAddress}
                    placeholder="?????a ch??? m?? ng?????i kh??c c?? th??? ?????n g???p b???n ?"
                />
                <TextInput
                    style={styles().TextInput}
                    onChangeText = {onChangePhone}
                    placeholder="Nh???p email gi??p l???y l???i m???t kh???u n???u qu??n"
                />
                <TouchableOpacity 
                    onPress={
                        email == '' ?  
                            ()=>{} : 
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ?  
                                ()=>{}:()=>{VerifyInfoAccount()}}
                    activeOpacity = {email == '' ?  1 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? 1:0.7}
                    style={styles(email,password,inputName,inputAddress).Button}>
                    <Text style={{color:'white',textAlign:'center'}}>????ng k??</Text>
                </TouchableOpacity>
            </View>
            <View style={styles().Footer}>
                <Text style={{fontWeight:"600",textAlign:"center"}}>B???n ???? c?? t??i kho???n ?</Text>
                <Text style={styles().LinkText}
                    onPress={()=>navigation.navigate('LoginScreen')}
                >????ng nh???p ngay</Text>
            </View>
            </ImageBackground>
            <NormalAlert
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                content = {message}
            />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles =(email,password,inputName,Address)=> StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal:0,
    },
    Header: {
        paddingTop:50,
        paddingHorizontal:10,
        backgroundColor:'rgba(255,255,255,0.9)'
    },
    Body: {
        paddingTop:20,
        paddingHorizontal:10,
        backgroundColor:'rgba(255,255,255,0.9)',
    },
    Footer: {
        flex:1,
        paddingHorizontal:10,
        backgroundColor:'rgba(255,255,255,0.9)',
        paddingTop:20,
    },
    TextInput:{
        borderColor:'black',
        borderRadius:5,
        borderWidth:0.5,
        padding:5,
        paddingLeft:15,
        marginBottom:10,
        backgroundColor:'white'
    },
    Button:{
        backgroundColor: 
            email == '' ?  '#999999' : 
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? 
                '#999999':
                password == '' ? 
                '#999999': 
                inputName == '' ? 
                '#999999': 
                Address == '' ? 
                '#999999': 
                '#2596be',
        width:'100%',
        padding:8,
        borderRadius:5,
    },
    LinkText:{
        color:'#2596be',
        fontWeight:'500',
        textAlign:'center',
        padding:10,
    }

})

export default RegisterScreen