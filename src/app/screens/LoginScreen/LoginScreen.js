import * as React from "react"
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
} from 'react-native'
import NormalAlert from '../../components/modals/NormalAlert'
import { auth,db } from '../../firebase/config'
import { signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import {set,ref} from 'firebase/database'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import styles from './styles'
const {width,height} = Dimensions.get('screen');

const LoginScreen = ({navigation}) => {
    //Variables
    const [message,setMessage] = React.useState('');
    const [email,onChangeEmail] = React.useState("");
    const [password,onChangePassword] = React.useState("");
    const [disabled,setdisabled] = React.useState(true);
    const [modalVisible,setModalVisible] = React.useState(false);
    //Functions
    const uid = auth.currentUser == null ? '' : auth.currentUser.uid;
    console.log(uid);
    onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.replace('MainTabNavigator');
        } 
    });
    const CreateAccount = async(email,password,user) => {
        await createUserWithEmailAndPassword(auth,email, password)
        .then((userCredential)=>{
            updateProfile(auth.currentUser, {
                displayName: user.name, 
                photoURL: user.photo
              }).then(() => {
                var date = new Date().getDate(); //Current Date
                var month = new Date().getMonth() + 1; //Current Month
                var year = new Date().getFullYear(); //Current Year
                set(ref(db,'SaveList/'+userCredential.user.uid),{
                    0:''
                });
                set(ref(db, 'users/' + userCredential.user.uid), {
                    photo:user.photo,
                    name: user.name,
                    email: email,
                    address: '',
                    phone: '',
                    createAt: `${date}/${month}/${year}`
                  });
              }).catch((error) => {
                console.log(error.message);
              });
        })
        .catch((error)=>{ console.log(error.message)})
    }
    const signIn = async () => {
        try 
        {
            await GoogleSignin.signOut();
            GoogleSignin.configure({
              webClientId:'122606372840-i2oh8gqi8fh8gdr8jlo177go4s2uj5qk.apps.googleusercontent.com',
              webClientSecret:'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'
          });
          await GoogleSignin.hasPlayServices();
          const {user} = await GoogleSignin.signIn();
          const email = user.email;
          const password = '000000';
          console.log(email);
          await signInWithEmailAndPassword(auth,email, password)
          .then(()=>{
            navigation.replace('MainTabNavigator');
          })
          .catch((error)=>{
              if(error.code == 'auth/user-not-found')
              {
                  CreateAccount(email,password,user);
              }
          })

        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.log('user cancelled the login flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            console.log('operation (e.g. sign in) is in progress already');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.log('play services not available or outdated');
          } else {
            // some other error happened
            console.log({error});
          }
        }
      };

    const SignInChatApps = async()=>{
        await signInWithEmailAndPassword(auth,email, password)
        .then(()=>{
            navigation.replace('MainTabNavigator')
        })
        .catch((error)=>{
            if(error.code == 'auth/user-not-found')
            {
                setMessage('Tài khoản không tồn tại\nVui lòng kiểm tra lại tài khoản.');
                setModalVisible(!modalVisible);
            }
        })
        
    }

    //Error : signInWithPopup is not function
    // const signInWithGoogle = async ()=>{
    //     const provider = new GoogleAuthProvider();//Create variables provider
    //     await signInWithPopup(auth, provider)
    //     .then((result) => {
    //         // This gives you a Google Access Token. You can use it to access the Google API.
    //         const credential = GoogleAuthProvider.credentialFromResult(result);
    //         const token = credential.accessToken;
    //         // The signed-in user info.
    //         const user = result.user;
    //         console.log(user);
    //         // ...
    //     }).catch((error) => {
    //         // Handle Errors here.
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // The email of the user's account used.
    //         const email = error.email;
    //         // The AuthCredential type that was used.
    //         const credential = GoogleAuthProvider.credentialFromError(error);
    //         // ...
    //     });
        
    // }

    const signInGoogleByRedirect = async()=>{
        
        try{
            GoogleSignin.configure();
            await GoogleSignin.hasPlayServices();
            const {idToken} = await GoogleSignin.signIn();
            console.log({idToken});
            const provider = new GoogleAuthProvider(idToken);
            await signInWithRedirect(auth, provider);cdcd
        }
        catch(error)
        {
            console.log({error});
        }
    }

    const signInWithFacebook = ()=>{

    }
    return(
        <SafeAreaView style={styles().container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <ImageBackground
                style={{width:width,height:height,opacity:1,}}
                resizeMode='cover'
                source={require('../../assets/images/connectPeople.png')}
            >
            <View style={styles().LoginHeader}>
                <Text
                    style={{fontWeight:"800",color:'#2596be',fontSize:26}}
                >Đăng nhập</Text>
                <Text style={{fontWeight:"600",fontSize:16}}>Chào mừng bạn</Text>
            </View>
            <View style={styles().LoginBody}>
                <TextInput
                    style={styles().LoginTextInput}
                    onChangeText={onChangeEmail}
                    placeholder="Nhập email của bạn"
                />
                <TextInput
                    style={styles().LoginTextInput}
                    onChangeText = {onChangePassword}
                    secureTextEntry={password == "" ? false : true}
                    placeholder="Nhập mật khẩu"
                />
                <TouchableOpacity 
                    onPress={email == '' ?  ()=>{} : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ?  ()=>{}:()=>{SignInChatApps()}}
                    activeOpacity = {email == '' ?  1 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? 1:0.7}
                    style={styles(email,password).LoginButton}>
                    <Text style={{color:'white',textAlign:'center'}}>Đăng nhập</Text>
                </TouchableOpacity>
                <Text
                    style={styles().LinkText}
                    onPress={()=>{alert("Quên mật khẩu")}}
                >Quên mật khẩu</Text>
            </View>
            <View style={styles().LoginFooter}>
                <Text style={{fontWeight:"600",textAlign:"center"}}>Bạn chưa có tài khoản ?</Text>
                <Text style={styles().LinkText}
                    onPress={()=>navigation.navigate('RegisterScreen')}
                >Đăng ký ngay</Text>
                <Text style={{fontWeight:"600",textAlign:"center"}}>Hoặc sử dụng</Text>
                <View style={{flexDirection:'column',justifyContent: 'center',paddingTop:20,}}>
                    <TouchableOpacity
                        style={{
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor:'white',
                            width:width-20,
                            borderRadius:5,
                            elevation: 2,
                            height:width/8+10,
                            marginBottom:10,
                        }}
                        activeOpacity={0.8}
                        onPress={()=>{
                            setMessage('Tính năng đang được cập nhật');
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Image
                            
                            style={{width:width/10,height:width/10,marginHorizontal:10}}
                            resizeMode='contain'
                            source={{uri:'https://www.facebook.com/images/fb_icon_325x325.png'}}
                        />
                        <Text style={{textAlign: 'center',fontWeight:'bold'}}>
                            Sign In with Facebook
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection:'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor:'white',
                            width:width-20,
                            borderRadius:5,
                            elevation: 2,
                            shadowOffset: {
                                width:20,
                                height:20
                            },
                            height:width/8+10,
                        }}
                        activeOpacity={0.8}
                        onPress={signIn}
                    >
                        <Image
                            style={{width:width/10,height:width/10,marginHorizontal:10}}
                            resizeMode='contain'
                            source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png'}}
                        />
                        <Text style={{textAlign: 'center',fontWeight:'bold'}}>
                            Sign In with Google
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ImageBackground>
            <NormalAlert
                content = {message}
                modalVisible = {modalVisible}
                setModalVisible = {setModalVisible}
            />
            </ScrollView>
        </SafeAreaView>
    )
};

export default LoginScreen