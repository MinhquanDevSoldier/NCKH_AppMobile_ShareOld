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
import ChatListItem from '../../components/ChatListItem'
import {auth,db} from '../../firebase/config'
import {onValue,ref,update,orderByChild,push,child,query,equalTo} from 'firebase/database'
import {Icons} from ''
const {width,height} = Dimensions.get('screen');
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const ChatListScreen = ({navigation}) => {
    const uid = auth.currentUser == null ? '' : auth.currentUser.uid;
    const [posts,setPosts] =  useState([])
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
        updates['posts/'+newRoom] = Room;
        update(ref(db),updates);
    }
    const Openpostscreen = (props)=>{
        navigation.navigate('postscreen',{idRoom:props.idRoom,name:props.nameAnotherUser})
    }

    //useEffect
    useEffect(()=>{
        const PersonalPostsRef = query(ref(db, 'Posts'),orderByChild('CreateBy'),equalTo(uid));
        onValue(PersonalPostsRef,(snapshot)=>{
            var listPost = [];
            snapshot.forEach((childSnapshot)=>{
                listPost.push({key:childSnapshot.key,val:childSnapshot.val()})
            })
            setPosts(listPost);
        })
    },[]);
    return(
        <SafeAreaView style={styles().ChatListContainer}>
            <View style={styles(width, height).ChatListHeader}>
                <Text style={styles().TextHeader}>Bài đăng của bạn</Text>
            </View>
            
            <View style={{flex:1,flexDirection: 'column',marginTop:0}}>
            {   
                uid == '' 
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
                posts.length == 0 || posts == null
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
                    style={{}}
                    data={posts}
                    renderItem={(data)=>
                        <TouchableOpacity
                            style={styles().postItem}
                            onPress={()=>{
                                navigation.navigate('PostDetailScreen',
                                {
                                    keyPost:posts[data.index].key,
                                    Type:'personal',
                                    userPostID:posts[data.index].val.CreateBy
                                })
                            }}
                        >
                            <Image
                                style={{width:60,height:60,borderRadius:5,backgroundColor:'white'}}
                                source={{uri:posts[data.index].val.DescriptionPhoto}}
                            />
                            <View>
                                <Text style={styles(width, height).textTitle} >{posts[data.index].val.Title}</Text>
                                <Text style={styles().textTime} >{posts[data.index].val.CreateAtDate}</Text>
                            </View> 
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
const styles =(width,height)=> StyleSheet.create({
    //Item
    textTitle:{
        fontWeight:'500',
        fontSize:16,
        width:width-100,
        paddingHorizontal:10,
        color:'black'
    },
    textTime:{
        position: 'absolute',
        fontWeight:'300',
        fontSize:14,
        bottom:0,
        right:0,
    },
    postItem:{
        position:'relative',
        flexDirection:'row',
        backgroundColor:'#D6DBDF',
        marginVertical:5,
        marginHorizontal:10,
        borderRadius:10,
        padding:5,
        elevation:2,
    },
    //Main
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
        paddingTop:5,
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
    }
})

export default ChatListScreen