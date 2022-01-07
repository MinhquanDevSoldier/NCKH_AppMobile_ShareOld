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
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {
    const [email,onChangeEmail] = React.useState("");
    const [password,onChangePassword] = React.useState("");
    const [disabled,setdisabled] = React.useState(true);
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.navigate('MainScreen')
          console.log(user);
        } else {

        }
    });

    const SignInChatApps = ()=>{
        signInWithEmailAndPassword(auth,email, password)
        .then(()=>{
            navigation.navigate('MainScreen')
        })
        .catch((error)=>{alert(error.message)})
        
    }
    return(
        <SafeAreaView style={LoginStyles().container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <ImageBackground
                style={{width:windowWidth-20,height:windowHeight,opacity:1,}}
                resizeMode='cover'
                source={require('../assets/image/connectPeople.png')}
            >
            <View style={LoginStyles().LoginHeader}>
                <Text
                    style={{fontWeight:"800",color:'#2596be',fontSize:26}}
                >Đăng nhập</Text>
                <Text style={{fontWeight:"600",fontSize:16}}>Chào mừng bạn</Text>
            </View>
            <View style={LoginStyles().LoginBody}>
                <TextInput
                    style={LoginStyles().LoginTextInput}
                    onChangeText={onChangeEmail}
                    placeholder="Nhập email của bạn"
                />
                <TextInput
                    style={LoginStyles().LoginTextInput}
                    onChangeText = {onChangePassword}
                    secureTextEntry={password == "" ? false : true}
                    placeholder="Nhập mật khẩu"
                />
                <TouchableOpacity 
                    onPress={email == '' ?  ()=>{} : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ?  ()=>{}:()=>{SignInChatApps()}}
                    activeOpacity = {email == '' ?  1 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? 1:0.7}
                    style={LoginStyles(email,password).LoginButton}>
                    <Text style={{color:'white',textAlign:'center'}}>Đăng nhập</Text>
                </TouchableOpacity>
                <Text
                    style={LoginStyles().LinkText}
                    onPress={()=>{alert("Quên mật khẩu")}}
                >Quên mật khẩu</Text>
            </View>
            <View style={LoginStyles().LoginFooter}>
                <Text style={{fontWeight:"600",textAlign:"center"}}>Bạn chưa có tài khoản ?</Text>
                <Text style={LoginStyles().LinkText}
                    onPress={()=>navigation.navigate('RegisterScreen')}
                >Đăng ký ngay</Text>
                <Text style={{fontWeight:"600",textAlign:"center"}}>Hoặc sử dụng</Text>
                <View style={{flexDirection:'row',justifyContent: 'center'}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={()=>{alert("Sign In with Facebook")}}
                    >
                    <Image
                        
                        style={{width:windowWidth/8,height:100,marginRight:30}}
                        resizeMode='contain'
                        source={{uri:'https://www.facebook.com/images/fb_icon_325x325.png'}}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={()=>{alert("Sign In with Gmail")}}
                    >
                    <Image
                        style={{width:windowWidth/8,height:100}}
                        resizeMode='contain'
                        source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png'}}
                    />
                    </TouchableOpacity>
                </View>
            </View>
            </ImageBackground>
            </ScrollView>
        </SafeAreaView>
    )
};

const LoginStyles =(email,password)=> StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal:10,
    },
    LoginHeader: {
        paddingTop:50,
        backgroundColor:'white',
        opacity:0.9
    },
    LoginBody: {
        paddingTop:20,
        backgroundColor:'white',
        opacity:0.9
    },
    LoginFooter: {
        flex:1,
        backgroundColor:'white',
        opacity:0.9
    },
    LoginTextInput:{
        borderColor:'black',
        borderRadius:5,
        borderWidth:0.5,
        padding:5,
        paddingLeft:15,
        marginBottom:10,
        backgroundColor:'white'
    },
    LoginButton:{
        backgroundColor: email == '' ?  '#999999' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == false ? '#999999':'#2596be',
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

export default LoginScreen