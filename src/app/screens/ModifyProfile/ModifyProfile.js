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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import NormalAlert from '../../components/modals/NormalAlert';
import { auth,db } from '../../firebase/config';
import {set,push,child,update,ref,onValue} from 'firebase/database';
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;

const ModifyProfile = ({navigation})=>{
    //Variables
    const [email,onChangeEmail] = useState("");
    const [password,onChangePassword] = useState("");
    const [inputName,onChangeInputName] = useState('');
    const [inputAddress,onChangeAddress] = useState('');
    const [inputPhone,onChangePhone] = useState('');
    const [inputAvatar,setAvatar] = useState('');
    const [message,setMessage] = useState('');
    const [disabled,setdisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const uid = auth.currentUser.uid;
    const [userInfo,SetUserInfo] = useState({});

    //useEffect
    useEffect(()=>{
        onValue(ref(db,'users/'+uid),(snapshot)=>{
            SetUserInfo(snapshot.val());
            onChangeAddress(snapshot.val().Address);
            onChangeInputName(snapshot.val().username);
            onChangePhone(snapshot.val().Phone);
            setAvatar(snapshot.val().Avatar);
        })
    },[])

    //Functions
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

    const updateInfo = (name,address,phone,avatar)=>{
        const updates = {};
        updates['/users/'+uid+'/username'] = name;
        updates['/users/'+uid+'/Address'] = address;
        updates['/users/'+uid+'/Phone'] = phone;
        updates['/users/'+uid+'/Avatar'] = avatar;
        return update(ref(db),updates);
    }
    const VerifyInfoAccount = (name,address,phone,avatar)=>{
        if(name == '')
        {
            setMessage('Tên không được để trống');
        }
        else if(address == '')
        {
            setMessage('Nhà bạn ở đâu thế ? ( Chưa địa chỉ )');
        }
        else {
            setMessage('Thông tin cá nhân đã được cập nhật');
            updateInfo(name, address,phone,avatar);
        }
        setModalVisible(!modalVisible);
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
                const source = 'data:'+result[0].type+';base64,' + result[0].base64;
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
                //console.log(source);
                setAvatar(source);
            }
        });
    }
    console.log(inputName);
    //Main
    return(
        <SafeAreaView style={styles().container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {/* <ImageBackground
                    style={{width:windowWidth-20,height:windowHeight,}}
                    resizeMode='cover'
                    source={require('../../assets/images/connectPeople.png')}
                > */}
                <View style={{flex:1,backgroundColor:'rgba(255,255,255,0.8)'}}>
                    <View style={styles().Header}>
                        <Text
                            style={{fontWeight:"800",color:'#2596be',fontSize:26}}
                        >Cập nhật thông tin cá nhân</Text>
                        <Text style={{fontWeight:"600",fontSize:16}}>Thông tin</Text>
                    </View>
                    <View style={styles().Body}>
                        {/* <TextInput
                            style={styles().TextInput}
                            onChangeText={onChangeEmail}
                            placeholder="Nhập email của bạn"
                        />
                        <TextInput
                            style={styles().TextInput}
                            onChangeText = {onChangePassword}
                            //secureTextEntry={password == "" ? false : true}
                            placeholder="Nhập mật khẩu"
                        /> */}
                        <Image
                            style={{
                                width:windowWidth-20,
                                height:windowWidth-20,
                                marginVertical:10,
                                borderRadius:15,
                            }}
                            resizeMode='cover'
                            source={{uri:inputAvatar}}
                        />
                        <TouchableOpacity
                            style={[styles().Button,styles().rightButton]}
                            onPress={getImageFromLibrary}
                        >
                            <Text
                                style={styles().normalText}
                            >Đổi ảnh</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles().TextInput}
                            onChangeText = {onChangeInputName}
                            placeholder="Bạn tên gì ?"
                            value={inputName}
                        />
                        <TextInput
                            style={styles().TextInput}
                            onChangeText = {onChangeAddress}
                            placeholder="Địa chỉ mà người khác có thể đến gặp bạn ?"
                            value={inputAddress}
                        />
                        <TextInput
                            value={inputPhone}
                            style={styles().TextInput}
                            onChangeText = {onChangePhone}
                            placeholder="Số điện thoại để gọi cho bạn ? ( có thể bỏ qua )"
                        />
                        <TouchableOpacity 
                            onPress={()=>{VerifyInfoAccount(inputName,inputAddress,inputPhone,inputAvatar)}}
                            // activeOpacity = {email == '' ?  1 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? 1:0.7}
                            style={styles(email,password,inputName,inputAddress).Button}>
                            <Text style={{color:'white',textAlign:'center'}}>Cập nhật</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles().Footer}>
                        <Text style={{fontWeight:"600",textAlign:"center"}}>Bạn đã có tài khoản ?</Text>
                        <Text style={styles().LinkText}
                            onPress={()=>navigation.navigate('LoginScreen')}
                        >Đăng nhập ngay</Text>
                    </View> */}
                </View>
            {/* </ImageBackground> */}
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
        backgroundColor:'rgba(255,255,255,0.9)',
        paddingTop:20,
    },
    normalText:{
        fontWeight:'bold',
        textAlign:'center',
        color:'#ffffff'
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
        backgroundColor:'#2596be',
            // email == '' ?  '#999999' : 
            //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? 
            //     '#999999':
            //     password == '' ? 
            //     '#999999': 
            //     inputName == '' ? 
            //     '#999999': 
            //     Address == '' ? 
            //     '#999999': 
                
        width:'100%',
        padding:8,
        borderRadius:5,
        marginBottom:10,
    },
    rightButton: {
        backgroundColor:'#282c34',
        width:windowWidth/4,
        alignItems: 'center',
    },
    LinkText:{
        color:'#2596be',
        fontWeight:'500',
        textAlign:'center',
        padding:10,
    }

})

export default ModifyProfile