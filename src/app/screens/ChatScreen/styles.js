import React from 'react'
import {StyleSheet} from 'react-native'
import AppColors from '../../themes/AppColors'
export default (width,height) => StyleSheet.create({
    ChatContainer:{
        backgroundColor : AppColors.white,
        flex:1,
    },
    ChatContent:{
        flex:1,
        backgroundColor:'#ffff',
        paddingHorizontal:10,
        paddingVertical:10,
    },
    ChatHeader:{
        height : height*1/12,
        justifyContent: 'center',
        alignItems:'flex-start',
        backgroundColor : '#fff',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 5},
        shadowRadius: 10,
        elevation: 5,
    },
    ChatControl:{
        backgroundColor : '#fffe',
        flexDirection: 'row',
        backgroundColor : '#fff',
        justifyContent:"center",
        alignItems: 'center',
        paddingBottom:10,
        paddingLeft:10,
        paddingTop:5, 
    },
    TextHeader:{
        fontSize:20,
        paddingLeft:10,
        color:'black',
        fontWeight:'500',
    },
    Input:{
        width: width*5/6,
        backgroundColor : '#EAECEE',
        borderRadius:25,
        fontSize:16,
        paddingLeft:15,
        height:38,
    },
    ButtonSend:{
        width: width*1/6,
    },
    textSend:{
        fontSize:16,
        textAlign:'center',
        fontWeight:'900',
        color:'#2596be',
    },
    chatMessageCurrentUser:{
        backgroundColor:'#2596be',
        borderRadius:10,
        marginBottom:5,
        marginLeft:width*1/4,
        alignSelf:'flex-end'
    },
    textMessageCurrentUser:{
        color:"white",
        padding:10,
        textAlign:'justify',
    },
    chatMessageAnotherUser:{
        backgroundColor : '#E5E7E9',
        borderRadius:10,
        marginBottom:5,
        marginRight:width*1/4,
        alignSelf: 'flex-start'
    },
    textMessageAnothertUser:{
        color:'black',
        padding:10,
        textAlign:'justify',
    },
    textTime:{
        paddingBottom:5,
        alignSelf:'flex-end',
        fontSize:12,
        fontWeight:'400'
    },
    textTimeCurrentUser:{
        alignSelf:'flex-end',
        paddingRight:10,
    },
    textTimeAnother:{
        alignSelf:'flex-start',
        paddingLeft:10,
    }
})