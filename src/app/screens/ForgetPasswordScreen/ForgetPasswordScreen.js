import * as React from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    Dimensions
} from 'react-native'
const {width, height} = Dimensions.get('window')

const ForgetPassScreen = () => {
    return(
        <SafeAreaView style={forgetPassStyles.container}>
            <Text style={forgetPassStyles.textHeader}>Lấy lại mật khẩu</Text>
            <View style={forgetPassStyles.body}>
                <TextInput
                    style={forgetPassStyles.input}
                    placeholder="Nhập Email của bạn để lấy lại mật khẩu"
                />
                <TouchableOpacity
                    style={forgetPassStyles.btnAccept}
                >
                    <Text style={forgetPassStyles.textAccept}>Đồng ý</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const forgetPassStyles = StyleSheet.create({
    textHeader:{
        backgroundColor:'#2596be',
        width:width,
        paddingLeft:15,
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        padding:10
    },
    input:{
        width:width-40,
        borderWidth:0.25,
        padding:5,
        paddingLeft:15,
        borderRadius:5,
        marginBottom:50,
        marginTop:20,
    },
    container:{

    },
    btnAccept:{
        backgroundColor:'#2596be',
        width:width-40,
        borderRadius:5
    },
    textAccept:{
        fontWeight: "bold",
        color: "white",
        textAlign:'center',
        padding:8,
        
    },
    body:{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:20
    }
})
export default ForgetPassScreen