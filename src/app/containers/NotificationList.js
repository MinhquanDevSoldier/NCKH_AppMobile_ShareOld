import React,{useState,useEffect,useRef} from "react"
import { 
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    FlatList,
    Image
} from 'react-native'
import ChatListItem from '../components/ChatListItem'
import {auth,db} from '../firebase/config'
import {onValue,ref,onChildChanged,update,push,child,onChildAdded,onChildRemoved} from 'firebase/database'
import {Icons} from ''
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const ChatListScreen = ({navigation}) => {
    const uid = 'asdasda';
    const [chats,setChats] =  useState([])
    //     ()=>{
    //     var listRoom = [];
    //     onValue(ref(db,'Chats'),(snapshot)=>{
    //         snapshot.forEach((childSnapshot)=>{
    //             childSnapshot.val().Member[0].uid == uid ? 
    //             listRoom.push(childSnapshot.val()):
    //             childSnapshot.val().Member[1].uid == uid ? 
    //             listRoom.push(childSnapshot.val()):null;
    //         })
    //     })

    //     return listRoom;
    // })
    const [search,onChangeSearch] = useState("");
    const [messages,onChangeMessages] = useState("");
    const scrollViewRef = useRef();

    
    

    const addRoom = ()=>{
        var datetime = new Date();
        var date = datetime.toLocaleDateString('en-GB');
        const Room = {
            CreateAt:date,
            LastMessage:'Hello Quan',
            Member:[
                {
                    DisplayName:'Tran Minh Quan',
                    uid:uid,
                },
                {
                    DisplayName:'Test User',
                    uid:'DDjvPDAPd5cyVeg6G2ZbZnbZqt',
                }
            ]
        }
        const newRoom = push(child(ref(db), 'Chasts')).key;
        const updates = {};
        updates['Chats/'+newRoom] = Room;
        return update(ref(db),updates);
    }
    const OpenChatScreen = (props)=>{
        navigation.navigate('ChatScreen',{idRoom:props.idRoom,name:props.nameAnotherUser})
    }

    //useEffect
    useEffect(()=>{
        onValue(ref(db,'Chats'),(snapshot)=>{
            var listRoom = [];
            snapshot.forEach((childSnapshot)=>{
                childSnapshot.val().Member[0].uid == uid ? 
                listRoom.push({key:childSnapshot.key,val:childSnapshot.val()}):
                childSnapshot.val().Member[1].uid == uid ? 
                listRoom.push({key:childSnapshot.key,val:childSnapshot.val()}):null;
            })
            setChats(listRoom);
        })
    },[]);
    return(
        <SafeAreaView style={chatListStyles.ChatListContainer}>
            <View style={chatListStyles.ChatListHeader}>
                <Text style={chatListStyles.TextHeader}>Danh sách bài đăng</Text>
            </View>
            
            <View style={{flex:1,flexDirection: 'column',marginTop:0}}>
            {   
                chats.length == 0 || chats == null
                ?
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex:1,
                    }}
                >
                    <Icon
                        name='list' 
                        style={{
                            textAlign: 'center',
                            fontSize: 80,
                            color: '#C5C3C3'
                        }}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16,color: '#C5C3C3'}}
                    >Hiện chưa có bài đăng nào</Text>
                </View>
                :
                <FlatList
                    style={chatListStyles.ChatListContent}
                    data={chats}
                    renderItem={(data)=>
                        <TouchableOpacity
                            onPress={()=>OpenChatScreen({
                                idRoom:chats[data.index].key,
                                nameAnotherUser: chats[data.index].val.Member[0].uid == uid 
                                ? chats[data.index].val.Member[1].DisplayName
                                : chats[data.index].val.Member[0].DisplayName
                            })}
                        >
                            {
                                chats[data.index].val.Member[0].DisplayName.includes(search)
                                ?
                                <ChatListItem 
                                    key={chats[data.index].key} 
                                    name={
                                        chats[data.index].val.Member[0].uid == uid 
                                        ? chats[data.index].val.Member[1].DisplayName
                                        : chats[data.index].val.Member[0].DisplayName
                                    } 
                                    lastMessage={chats[data.index].val.LastMessage}/>
                                :chats[data.index].val.Member[1].DisplayName.includes(search)
                                ?
                                <ChatListItem 
                                key={chats[data.index].key} 
                                name={
                                    chats[data.index].val.Member[0].uid == uid 
                                    ? chats[data.index].val.Member[1].DisplayName
                                    : chats[data.index].val.Member[0].DisplayName
                                } 
                                lastMessage={chats[data.index].val.LastMessage}/>
                                :null
                            }
                            
                        </TouchableOpacity>  
                    }
                    showsVerticalScrollIndicator={false}
                />
            }
            </View>
        </SafeAreaView>
    );
}
//App Color : '#2596be'
const chatListStyles = StyleSheet.create({
    TextHeader:{
        fontSize:20,
        paddingLeft:10,
        color:'white',
        fontWeight:'500',
    },
    ChatListContainer:{
        //height : windowHeight,
        backgroundColor : 'white',
        flex:1,
    },
    ChatListContent:{
        flex:1,
        backgroundColor:'#ffff',
        paddingHorizontal:10,
        paddingTop:10,
        
    },
    ChatListHeader:{
        height : windowHeight*1/14,
        justifyContent: 'center',
        alignItems:'flex-start',
        backgroundColor:'#2596be',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 5},
        shadowRadius: 10,
        elevation: 5,
        paddingTop:5,
    },
    InputSearch:{
        backgroundColor:'#ececec',
        width:windowWidth-20,
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
    }
})

export default ChatListScreen