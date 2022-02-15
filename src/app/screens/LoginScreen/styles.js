import React from 'react'
import {StyleSheet} from 'react-native'

export default styles =(email,password)=> StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal:0,
    },
    LoginHeader: {
        paddingTop:50,
        paddingHorizontal:10,
        backgroundColor:'white',
        opacity:0.9
    },
    LoginBody: {
        paddingHorizontal:10,
        paddingTop:20,
        backgroundColor:'white',
        opacity:0.9
    },
    LoginFooter: {
        paddingHorizontal:10,
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