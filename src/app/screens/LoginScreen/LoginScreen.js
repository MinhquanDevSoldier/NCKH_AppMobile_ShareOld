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
import { auth } from '../../firebase/config'
import { signInWithEmailAndPassword,onAuthStateChanged,signInWithPopup,GoogleAuthProvider,signInWithRedirect} from "firebase/auth";
import styles from './styles'
const {width,height} = Dimensions.get('screen');

const LoginScreen = ({navigation}) => {
    //Variables
    const [email,onChangeEmail] = React.useState("");
    const [password,onChangePassword] = React.useState("");
    const [disabled,setdisabled] = React.useState(true);
    
    //Functions
    onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.replace('MainTabNavigator')
        } else {

        }
    });

    const SignInChatApps = ()=>{
        signInWithEmailAndPassword(auth,email, password)
        .then(()=>{
            navigation.replace('MainTabNavigator')
        })
        .catch((error)=>{alert(error.message)})
        
    }

    const signInWithGoogle = ()=>{
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
        
    }

    const signInGoogleByRedirect = ()=>{
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
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
                        onPress={()=>{alert("Sign In with Facebook")}}
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
                        onPress={signInGoogleByRedirect}
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
            </ScrollView>
        </SafeAreaView>
    )
};

export default LoginScreen