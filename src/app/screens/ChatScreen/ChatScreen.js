import React,{useState,useRef,useEffect} from "react"
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
import firebaseApp,{ auth,db } from "../../firebase/config";
import {onValue,ref,onChildChanged,update,push,child,onChildAdded,onChildRemoved} from 'firebase/database'
import styles from './styles'
const {width,height} = Dimensions.get('screen'); 

const ChatMessage = (Props) => {
    return(
        <View style={Props.uid == Props.currentID ? styles(width, height).chatMessageCurrentUser:styles(width, height).chatMessageAnotherUser}>
            <Text style={Props.uid == Props.currentID ? styles(width, height).textMessageCurrentUser:styles(width, height).textMessageAnothertUser}>{Props.messages}</Text>
            <Text style={[styles().textTime,Props.uid == Props.currentID ? styles().textTimeCurrentUser:styles().textTimeAnother]}>{Props.time}</Text>
        </View>
    )
}

const ChatScreen = ({route}) => {
    const [userindex,setUserIndex] = useState(()=> {return true});
    const [chats,setChats] =  useState([]);
    const [user,setUser] = useState([]);
    const [messages,onChangeMessages] = useState("");
    const scrollViewRef = useRef();
    const uid = auth.currentUser.uid;
    const [idRoom,setIDRoom] = useState(route.params.idRoom);
    const uid2 = route.params.uid2;
    const user2 = route.params.name;

    const sendMessage = ()=>{
        if(idRoom == null)
        {
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds();

            const newChatMessage = {
                message: messages,
                sentBy:uid,
                sentDate:date+'/'+month+'/'+year,
                sentTime:hours+":"+min,
            }
            const newChatsRoom = {
                CreateAt:`${hours+":"+min} ${date+'/'+month+'/'+year}`,
                LastMessage:{
                    val:messages
                },
                Member:[
                        {
                            uid:uid,
                            displayName:auth.currentUser.displayName
                        },
                        {
                            uid:uid2,
                            displayName:user2
                        }
                    ]
            };
            
            const newChatsRoomKey = push(child(ref(db), 'Chats')).key;
            const newMessageKey = push(child(ref(db), 'ChatMessage')).key;
            const updates = {};
            const linkRoom1 = [
                {
                    userPartner:uid2,
                    idRoom:newChatsRoomKey
                }
            ]
            const linkRoom2 = [
                {
                    userPartner:uid,
                    idRoom:newChatsRoomKey
                }
            ]
            updates['/users/'+uid+'/linkRoom'] = linkRoom1;
            updates['/users/'+uid2+'/linkRoom'] = linkRoom2;
            updates ['Chats/'+newChatsRoomKey] = newChatsRoom;
            const User = [uid,uid2]
            updates ['ChatMessage/'+newChatsRoomKey+'/User'] = User;
            updates ['ChatMessage/'+newChatsRoomKey+'/'+uid+'/message/'+newMessageKey] = newChatMessage;
            updates ['ChatMessage/'+newChatsRoomKey+'/'+uid2+'/message/'+newMessageKey] = newChatMessage;
            setIDRoom(newChatsRoomKey);
            onChangeMessages('');
            return update(ref(db),updates);    
        }
        else
        {
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds();

            const newMessage = {
                message: messages,
                sentBy:uid,
                sentDate:date+'/'+month+'/'+year,
                sentTime:hours+":"+min,
            }
            const ChatsRoom = {
                CreateAt:`${hours+":"+min} ${date+'/'+month+'/'+year}`,
                LastMessage: {
                    val:messages,
                },
                Member:[
                    {
                        uid:uid,
                        displayName:auth.currentUser.displayName
                    },
                    {
                        uid:user.length == 0 ? '' : user[0].includes(uid) ? user[1] : user[0],
                        displayName:user2
                    }
                ]
            };
            const newMessageKey = push(child(ref(db), 'ChatMessage')).key;
            const updates = {};
            if(uid2 == '')
            {
                var uidUser2 = user[0].includes(uid) ? user[1] : user[0];
                updates['Chats/'+idRoom] = ChatsRoom;
                updates['ChatMessage/'+idRoom+'/'+uid+'/message/'+newMessageKey] = newMessage;
                updates['ChatMessage/'+idRoom+'/'+uidUser2+'/message/'+newMessageKey] = newMessage;
            }
            else
            {
                updates['Chats/'+idRoom+'/LastMessage/'] = {
                    val:messages
                };
                updates['ChatMessage/'+idRoom+'/'+uid+'/message/'+newMessageKey] = newMessage;
                updates['ChatMessage/'+idRoom+'/'+uid2+'/message/'+newMessageKey] = newMessage;
            }
            onChangeMessages('');
            return update(ref(db),updates);
        }
    }
    const setChatData = ()=>{
        console.log(user[0].includes(uid) ? user[1] : user[0]);
    }
    console.log(user);
    useEffect(()=>{
        onValue(ref(db,'ChatMessage/'+idRoom+'/'),(snapshot)=>{
            var User = typeof(snapshot.val()) == undefined ? [] : snapshot.val() == null ? [] : snapshot.val().User;
            setUser(User)
        });
    },[idRoom])

    useEffect(()=>{
        onValue(ref(db,'ChatMessage/'+idRoom+'/'+uid+'/message'),(snapshot)=>{
            var chatMessage = [];
            snapshot.forEach((childSnapshot)=>{
                chatMessage.push({key:childSnapshot.key,val:childSnapshot.val()});
            })
            setChats(chatMessage)
        })
    },[idRoom])
    return(
        <SafeAreaView style={styles().ChatContainer}>
            <View style={styles(width, height).ChatHeader}>
                <Text style={styles().TextHeader}>{user2}</Text>
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
                    <Image
                        style={{
                            width:width/4,
                            height:height/6
                        }}
                        resizeMode="contain"
                        source={require('../../assets/images/newChat.png')}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16}}
                    >Gửi gì đó để bắt đầu cuộc trò chuyện</Text>
                </View>
                :
                <FlatList
                    style={styles().ChatContent}
                    data={chats}
                    renderItem={(data)=>
                        <ChatMessage 
                            currentID={uid} 
                            key={chats[data.index].key} 
                            uid={chats[chats.length - data.index - 1].val.sentBy} 
                            messages={chats[chats.length - data.index - 1].val.message}
                            time={chats[chats.length - data.index - 1].val.sentTime}
                        />  
                    }
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToOffset({animated:true,offset:0})}
                    onLayout={() => scrollViewRef.current.scrollToOffset({animated:true,offset:0})}
                    inverted
                />
            }
                <View style={styles().ChatControl}>
                    <TextInput
                        placeholder="Nhập tin nhắn..."
                        style={styles(width, height).Input}
                        onChangeText = {onChangeMessages}
                        value = {messages}
                    />
                    <TouchableOpacity
                        onPress={messages != '' ? sendMessage : setChatData}
                        style={styles(width, height).ButtonSend}
                    >
                        <Text style={styles().textSend}>Send</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

export default ChatScreen