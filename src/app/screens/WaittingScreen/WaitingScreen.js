import React,{useState,useEffect} from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native'
//import styles from './styles'
const {width,height} = Dimensions.get('screen');

const WaitingScreen = ({navigation}) =>{
    const Wait=()=>{
        const myTimeout = setTimeout(GotoMain, 2000);   
    }        
    function GotoMain() {
        navigation.replace('MainTabNavigator');
    }
    Wait();
    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.Container}>
                <Image source={require('../../assets/images/handshake.png')} style={{width:200,height:200}}/>
                <Text style={styles.Text}>Chia sẻ </Text>
                <Text style={styles.Text}>đồ qua sử dụng</Text>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    Container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
    },
    Text:{
        fontSize:36,
        fontWeight:'bold',
        textAlign:'center'
    }
})

export default WaitingScreen;