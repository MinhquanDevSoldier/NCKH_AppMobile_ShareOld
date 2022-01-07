import * as React from "react"
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
import firebaseApp,{ auth,db } from "./firebase/config";
import { collection,doc,onSnapshot,setDoc,getDoc,addDoc} from "firebase/firestore"; 
import {createUserWithEmailAndPassword} from 'firebase/auth'
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;

const ChatMessage = (Props) => {
    return(
        <View style={Props.uid == 'Bobs' ? chatStyles.chatMessageCurrentUser:chatStyles.chatMessageAnotherUser}>
            <Text style={Props.uid == 'Bobs' ? chatStyles.textMessageCurrentUser:chatStyles.textMessageAnothertUser}>{Props.messages}</Text>
        </View>
    )
}
const App = () => {
    const [userindex,setUserIndex] = React.useState(()=> {return true});
    const [chats,setChats] =  React.useState(()=> {return []});
    const [messages,onChangeMessages] = React.useState("");
    const scrollViewRef = React.useRef();
    const citiesRef = collection(db, "cities");

    const sendMessage = ()=>{
        var chatnew = chats;
        chatnew.push({
            messages : messages,
            uid : userindex == true ?'Bobs':'Mike'
        });
        setUserIndex(!userindex);
        setChats(chatnew);
        onChangeMessages('');
    }
    const getChatData = ()=>{
        console.log('Get all data');
    }
    const setChatData = ()=>{
        createUserWithEmailAndPassword(auth,"minhquan13578@gmail.com","123123")
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.uid);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
          });
    }
    return(
        <SafeAreaView style={styles.ChatContainer}>
            <View style={styles.ChatHeader}>
                <Text style={styles.TextHeader}>Mike Taison</Text>
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
                            width:windowWidth/4,
                            height:windowHeight/6
                        }}
                        resizeMode="contain"
                        source={require('./resources/image/newChat.png')}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16}}
                    >Gửi gì đó để bắt đầu cuộc trò chuyện</Text>
                </View>
                :
                <FlatList
                    style={styles.ChatContent}
                    data={chats}
                    renderItem={(data)=>
                        <ChatMessage key={data.index} uid={chats[chats.length - data.index - 1].uid} messages={chats[chats.length - data.index - 1].messages}/>  
                    }
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToOffset({animated:true,offset:0})}
                    onLayout={() => scrollViewRef.current.scrollToOffset({animated:true,offset:0})}
                    inverted
                />
            }
                <View style={styles.ChatControl}>
                    <TextInput
                        placeholder="Nhập tin nhắn..."
                        style={chatStyles.Input}
                        onChangeText = {onChangeMessages}
                        value = {messages}
                    />
                    <TouchableOpacity
                        onPress={messages != '' ? sendMessage : setChatData}
                        style={chatStyles.ButtonSend}
                    >
                        <Text style={chatStyles.textSend}>Send</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    //App Color : '#2596be'
    ChatContainer:{
        //height : windowHeight,
        backgroundColor : 'white',
        flex:1,
    },
    ChatContent:{
        flex:1,
        backgroundColor:'#ffff',
        paddingHorizontal:10,
        paddingTop:10,
        
    },
    ChatHeader:{
        height : windowHeight*1/12,
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
        //height : windowHeight*1/12,
        //flex:1,
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
})
const chatStyles = StyleSheet.create({
    Input:{
        width: windowWidth*5/6,
        backgroundColor : '#EAECEE',
        borderRadius:25,
        fontSize:16,
        paddingLeft:15,
        height:38,
    },
    ButtonSend:{
        width: windowWidth*1/6,
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
        marginLeft:windowWidth*1/4,
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
        marginRight:windowWidth*1/4,
        alignSelf: 'flex-start'
    },
    textMessageAnothertUser:{
        color:'black',
        padding:10,
        textAlign:'justify',
    }
})

export default App