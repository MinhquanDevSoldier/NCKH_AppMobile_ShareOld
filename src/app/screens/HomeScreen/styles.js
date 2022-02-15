import React from 'react'
import { StyleSheet } from 'react-native'

export default (width,height) => StyleSheet.create({
    Container:{
        paddingHorizontal:10,
    },
    InputSearch:{
        backgroundColor:'#ececec',
        width:width-20,
        borderRadius:25,
        padding:5,
        paddingStart:25,
    },
    SearchBar:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom:10,
        backgroundColor:'white'
    },
    SlideBar:{

    },
    ItemBar:{

    },
    PostBody:{

    },
    titleDoc:{
        fontWeight:'900',
        fontSize:18,
        color:'black',
        paddingTop:5,
        paddingBottom:5
    }
})