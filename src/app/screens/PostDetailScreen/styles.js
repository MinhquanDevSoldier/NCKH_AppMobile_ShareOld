import React from 'react'
import {StyleSheet} from 'react-native'

export default (sizeContent)=> StyleSheet.create({
    contentBox:{
        backgroundColor:'white',
        marginVertical:4,
        borderRadius:5,
        elevation:2,
        paddingHorizontal:10,
        paddingBottom:sizeContent < 100 ? 50 : 10,
        paddingTop:10,
    },
    optionTopBar:{
        flexDirection:'row',
        //width:'100%',
    },
    textTitle: {
        color:'black',
        fontWeight:'800',
        fontSize:20,
    },
    textContent:{
        color:'black',
        fontWeight:'300',
        fontSize:16,
    },
    bottomView:{
        flex:1,
        flexDirection:'row',
    },
    topIcon:{
        borderRadius:5,
        marginVertical:2,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:8,
        paddingLeft:20,
        paddingRight:10
    },
    button:{
        flex:1,
        borderRadius:5,
        elevation:5,
        marginVertical:10,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
    },
    buttonMessage: {
        marginLeft:5,
        backgroundColor:'#154360'
    },
    buttonPhone:{
        marginRight:5,
        backgroundColor:'#008000',
    },
    textPhone:{
        fontWeight:'500',
        color:'#FFFF'
    },
    textMessage:{
        fontWeight:'500',
        color:'#FFFF'
    }  
})