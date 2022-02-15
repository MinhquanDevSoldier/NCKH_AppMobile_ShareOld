import React,{useState,useEffect} from 'react'
import {Image,View,Text,StyleSheet,Dimensions } from 'react-native'
import {onValue,ref,set} from 'firebase/database';
import {db,auth} from '../firebase/config'
const {width,height} = Dimensions.get('window');

const ChatListItem = (props) => {
    const [userPost,setUserPost] = useState({});
    //useEffect
    useEffect(()=>{
        onValue(ref(db,'users/'+props.uid),(snapshot)=>{
            snapshot.val() == null ? setUserPost([]) : setUserPost(snapshot.val());
        })
    },[])
    return(
        <View>
            <View
                style={chatListStyles.SearchBar}
            >
                <Image
                    style={{
                        width:width/6,
                        height:width/6,
                        borderRadius:width
                    }}
                    resizeMode="cover"
                    source={{uri:userPost.Avatar}}
                />
                <View
                    style={{paddingStart:15}}
                >
                    <Text style={{color: 'black',fontWeight:'800'}}>{props.name}</Text>
                    <Text>{props.lastMessage}</Text>
                </View>
            </View>
        </View>
    )
}
const chatListStyles = StyleSheet.create({
    SearchBar:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom:10,
        backgroundColor:'white'
    }
})
export default ChatListItem