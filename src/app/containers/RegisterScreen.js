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
import NormalAlert from '../components/modals/NormalAlert';
import { auth,db } from '../firebase/config';
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { set,ref } from 'firebase/database';
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;

const RegisterScreen = ({navigation})=>{
    const [email,onChangeEmail] = useState("");
    const [password,onChangePassword] = useState("");
    const [inputName,onChangeInputName] = useState('');
    const [inputAddress,onChangeAddress] = useState('');
    const [inputPhone,onChangePhone] = useState('');
    const [message,setMessage] = useState('');
    const [disabled,setdisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const CreateAccount = ()=>{
        createUserWithEmailAndPassword(auth,email, password)
        .then((userCredential)=>{
            updateProfile(auth.currentUser, {
                displayName: inputName, 
                photoURL: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
              }).then(() => {
                var date = new Date().getDate(); //Current Date
                var month = new Date().getMonth() + 1; //Current Month
                var year = new Date().getFullYear(); //Current Year
                var hours = new Date().getHours(); //Current Hours
                var min = new Date().getMinutes(); //Current Minutes
                var sec = new Date().getSeconds();
                set(ref(db, 'users/' + userCredential.user.uid), {
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
            setMessage('H??y cho ch??ng t???i v?? m???i ng?????i bi???t n??n g???i b???n l?? g?? ? ( Ch??a nh???p t??n )');
        }
        else if(inputAddress == '')
        {
            setMessage('Nh?? b???n ??? ????u th??? ? ( Ch??a ?????a ch??? )');
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
                style={{width:windowWidth-20,height:windowHeight,opacity:1,}}
                resizeMode='cover'
                source={require('../assets/image/connectPeople.png')}
            >
            <View style={styles().Header}>
                <Text
                    style={{fontWeight:"800",color:'#2596be',fontSize:26}}
                >????ng k??</Text>
                <Text style={{fontWeight:"600",fontSize:16}}>??i???n ?????y ????? c??c th??ng tin nh??</Text>
            </View>
            <View style={styles().Body}>
                <TextInput
                    style={styles().TextInput}
                    onChangeText={onChangeEmail}
                    placeholder="Nh???p email c???a b???n"
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
                    placeholder="S??? ??i???n tho???i ????? g???i cho b???n ? ( c?? th??? b??? qua )"
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
        paddingHorizontal:10,
    },
    Header: {
        paddingTop:50,
        backgroundColor:'rgba(255,255,255,0.9)'
    },
    Body: {
        paddingTop:20,
        backgroundColor:'rgba(255,255,255,0.9)'
    },
    Footer: {
        flex:1,
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