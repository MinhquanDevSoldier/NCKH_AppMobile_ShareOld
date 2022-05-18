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
    Image,
    Alert
} from 'react-native'
import ChatListItem from '../../components/ChatListItem'
import Icon from 'react-native-vector-icons/FontAwesome5';
import {auth,db} from '../../firebase/config'
import {onValue,ref,onChildChanged,update,push,child,onChildAdded,onChildRemoved} from 'firebase/database'
const {width,height} = Dimensions.get('window');

const ChatListScreen = ({navigation}) => {
    const user = auth.currentUser == null ? {} :auth.currentUser;
    const uidCheck = auth.currentUser == null ? '' : auth.currentUser.uid;
    const [chats,setChats] =  useState([])
    const [search,onChangeSearch] = useState("");
    const [messages,onChangeMessages] = useState("");
    const scrollViewRef = useRef();

    const RemoveChatRoom = (props)=>{
        Alert.alert(
            "Cảnh báo",
            "Xác nhận xóa đoạn hội thoại với "+props.name,
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              { text: "OK", onPress: () =>{
                const updates = {};
                updates['/Chats/'+props.idRoom+'/Member/'] = 
                        [
                            {
                                uid:'',
                                uidOld:props.uid3,
                                displayName:user.displayName
                            },
                            {
                                uid:props.uid2,
                                uidOld:props.uid2,
                                displayName:props.name
                            }
                        ]
                updates['/ChatMessage/'+props.idRoom+'/'+user.uid] = {
                    message:[
                    ],
                }
                return update(ref(db),updates);
              } }
            ]
          );
    }
    const addRoom = ()=>{
        var datetime = new Date();
        var date = datetime.toLocaleDateString('en-GB');
        const Room = {
            CreateAt:date,
            LastMessage:'Hello Quan',
            Member:[
                {
                    displayName:'Tran Minh Quan',
                    uid:user.uid,
                },
                {
                    displayName:'Test User',
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
        navigation.navigate('ChatScreen',{idRoom:props.idRoom,name:props.nameAnotherUser,uid2:props.uid2})
    }

    //useEffect
    useEffect(()=>{
        onValue(ref(db,'Chats'),(snapshot)=>{
            var listRoom = [];
            snapshot.forEach((childSnapshot)=>{
                childSnapshot.val().Member[0].uid == user.uid ? 
                listRoom.push({key:childSnapshot.key,val:childSnapshot.val()}):
                childSnapshot.val().Member[1].uid == user.uid ? 
                listRoom.push({key:childSnapshot.key,val:childSnapshot.val()}):null;
            })
            setChats(listRoom);
        })
    },[]);
    return(
        <SafeAreaView style={chatListStyles.ChatListContainer}>
            <View style={chatListStyles.ChatListHeader}>
                <Text style={chatListStyles.TextHeader}>Hộp thoại</Text>
            </View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding:5
            }}>
                <TextInput
                    style={chatListStyles.InputSearch}
                    onChangeText={onChangeSearch}
                    value={search}
                    placeholder="Tìm kiếm"
                />
            </View>
            <View style={{flex:1,flexDirection: 'column',marginTop:0}}>
            {   
                uidCheck == '' 
                ?
                <View
                    style={{height: height-100, paddingHorizontal:10,alignItems:'center',justifyContent:'center'}}
                >
                    <Text
                        style={{fontWeight:'bold',fontSize:24,textAlign: 'center'}}
                    >
                        Bạn cần đăng nhập trước khi dùng tính năng này
                    </Text>
                    <View style={{paddingVertical:10}}>
                        <TouchableOpacity
                            onPress={()=>{
                                auth.signOut();
                                navigation.replace('LoginScreen')
                            }}
                            style={{
                                backgroundColor:'#2596be',
                                width:'100%',
                                paddingHorizontal:50,
                                paddingVertical:10,
                                borderRadius:8,
                            }}
                        >
                            <Text style={{
                                color:'white',
                                fontWeight:'600',
                                textAlign:'center'
                            }}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                chats.length == 0
                ?
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex:1,
                    }}
                >
                    <Icon
                        name='comment-slash' 
                        style={{
                            textAlign: 'center',
                            fontSize: 80,
                            color: '#C5C3C3'
                        }}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16,color: '#C5C3C3'}}
                    >Danh sách trò chuyện rỗng</Text>
                </View>
                :
                <FlatList
                    style={chatListStyles.ChatListContent}
                    data={chats}
                    renderItem={(data)=>
                        <TouchableOpacity
                            onLongPress={()=>{
                                RemoveChatRoom({name:chats[data.index].val.Member[0].uid == user.uid 
                                    ? chats[data.index].val.Member[1].displayName
                                    : chats[data.index].val.Member[0].displayName,
                                    uid2:chats[data.index].val.Member[0].uid == user.uid 
                                    ? chats[data.index].val.Member[1].uid
                                    : chats[data.index].val.Member[0].uid,
                                    uid3:chats[data.index].val.Member[0].uid == user.uid 
                                    ? chats[data.index].val.Member[0].uid
                                    : chats[data.index].val.Member[1].uid,
                                    idRoom:chats[data.index].key})
                            }}
                            onPress={()=>OpenChatScreen({
                                idRoom:chats[data.index].key,
                                nameAnotherUser: chats[data.index].val.Member[0].uid == user.uid 
                                ? chats[data.index].val.Member[1].displayName
                                : chats[data.index].val.Member[0].displayName,
                                uid2:chats[data.index].val.Member[0].uid == user.uid
                                ? chats[data.index].val.Member[1].uid
                                : chats[data.index].val.Member[0].uid
                            })}
                        >
                            {
                                console.log(chats[data.index].val.LastMessage)
                            }
                            {
                                chats[data.index].val.Member[0].displayName.includes(search)
                                ?
                                <ChatListItem 
                                    uid={
                                        chats[data.index].val.Member[0].uid == user.uid 
                                        ? chats[data.index].val.Member[1].uidOld
                                        : chats[data.index].val.Member[0].uidOld
                                    } 
                                    key={chats[data.index].key} 
                                    name={
                                        chats[data.index].val.Member[0].uid == user.uid 
                                        ? chats[data.index].val.Member[1].displayName
                                        : chats[data.index].val.Member[0].displayName
                                    } 
                                    lastMessage={chats[data.index].val.LastMessage.val}/>
                                :chats[data.index].val.Member[1].displayName.includes(search)
                                ?
                                <ChatListItem 
                                    uid={
                                        chats[data.index].val.Member[0].uid == user.uid 
                                        ? chats[data.index].val.Member[1].uidOld
                                        : chats[data.index].val.Member[0].uidOld
                                    } 
                                    key={chats[data.index].key} 
                                    name={
                                        chats[data.index].val.Member[0].uid == user.uid 
                                        ? chats[data.index].val.Member[1].displayName
                                        : chats[data.index].val.Member[0].displayName
                                    } 
                                    lastMessage={chats[data.index].val.LastMessage.val}/>
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
        //height : height,
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
        height : height*1/14,
        justifyContent: 'center',
        alignItems:'flex-start',
        backgroundColor:'#2596be',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 5},
        shadowRadius: 10,
        elevation: 5,
    },
    InputSearch:{
        backgroundColor:'#ececec',
        width:width-20,
        borderRadius:10,
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