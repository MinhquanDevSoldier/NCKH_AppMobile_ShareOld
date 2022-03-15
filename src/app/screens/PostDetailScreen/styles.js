import React from 'react'
import {StyleSheet,Dimensions} from 'react-native'
const {width,height} = Dimensions.get('screen')

export default (sizeContent)=> StyleSheet.create({
    container: {
        paddingHorizontal:10
    },
    contentBox:{
        backgroundColor:'white',
        marginVertical:4,
        borderRadius:5,
        elevation:2,
        paddingHorizontal:10,
        paddingBottom:sizeContent < 100 ? 50 : 10,
        paddingTop:10,
        //position:'relative',
    },
    contentBox3:{
        flexDirection:'row',
        backgroundColor:'rgba(255,255,255,0)',
        elevation:0, 
    },
    contentBox2:{
        flexDirection:'row',
        backgroundColor:'rgba(255,255,255,0)',
        elevation:0, 
        borderTopWidth:1.5,
        paddingBottom:250,
    },
    optionTopBar:{
        flexDirection:'row',
        position:'relative',
        top:0,
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
    textLocation:{
        width:width-50
    },
    bottomView:{
        backgroundColor:'rgba(255,255,255,1)',
        flex:1,
        flexDirection:'row',
        position:'absolute',
        bottom:100,
        left:10,
        borderRadius:5
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