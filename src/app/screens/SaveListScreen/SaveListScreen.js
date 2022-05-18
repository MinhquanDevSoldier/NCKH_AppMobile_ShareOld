import React,{useState,useEffect} from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { faCoffee,faCalendarAlt,faMapMarkerAlt,faPhone } from '@fortawesome/free-solid-svg-icons'
import { db,auth } from '../../firebase/config'
import {signOut} from 'firebase/auth'
import { ref, onValue} from "firebase/database";
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const {width,height} = Dimensions.get('screen');
const SaveListScreen = ({navigation}) => {
    const uid =  auth.currentUser == null ? '' : auth.currentUser.uid;
    const [userInfo,SetUserInfo] = useState({});
    const [saveList,setSaveList] = useState([]);
    const [posts,setPosts] = useState([]);
    console.log("CurrentUser: "+uid);
    //useEffect
    useEffect(()=>{
        onValue(ref(db,'Posts'),(snapshot)=>{
            var Posts = [];
            if(snapshot.val() !=  null)
            {
                snapshot.forEach((childSnapshot)=>{
                    Posts.push({key: childSnapshot.key,val:childSnapshot.val()})
                })
            }
            setPosts(Posts);
        })
    },[])
    useEffect(()=>{
        onValue(ref(db,'SaveList/'+uid+"/"),(snapshot)=>{
            if(uid != "")
            {
                snapshot.val() == null ? setSaveList([]) : setSaveList(snapshot.val());
            }
            else
            {
                setSaveList([]);
            }
        })
    },[])
    useEffect(()=>{
        const UserRef = ref(db,'users/'+uid);
        onValue(UserRef,(snapshot)=>{
            const data = snapshot.val();
            SetUserInfo(data);
        })
    },[])
    console.log(saveList.length);
    return(
        <SafeAreaView>
            <View>
                <View style={{
                        height : height*1/14,
                        justifyContent: 'center',
                        alignItems:'flex-start',
                        backgroundColor:'#2596be',
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 5},
                        shadowRadius: 10,
                        elevation: 5,
                        paddingHorizontal:10
                        }}>
                    <Text style={{
                        fontWeight:'900',
                        paddingVertical:10,
                        fontSize:16,
                        }}>DANH SÁCH BÀI ĐĂNG ĐÃ LƯU ( tối đa 15 )</Text>
                </View>
                <View  style={{
                    paddingBottom:150,
                    paddingHorizontal:10  
                }}>
                {
                    saveList.length < 2 
                    ?
                    <View style={{paddingTop:height/3,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{textAlign: 'center'}}>Danh sách rỗng</Text>
                        <Image
                            style={{width:width/2,height:width/2,borderTopRightRadius:5,borderTopLeftRadius:5}}
                            resizeMode='stretch'
                            source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrsIEnZ-jYZo6lMV0N75P7N0FHeg4FUPQwOw&usqp=CAU'}}
                        />
                    </View>
                    :
                    <FlatList
                        style={{}}
                        data={posts}
                        renderItem={(data)=>
                            Array.isArray(saveList) 
                            ? saveList.includes(posts[data.index].key)
                                ?
                                <TouchableOpacity
                                style={styles().postItem}
                                onPress={()=>{
                                    navigation.navigate('PostDetailScreen',
                                    {
                                        keyPost:posts[data.index].key,
                                        // Type:route.params.val,
                                        userPostID:posts[data.index].val.CreateBy
                                    })
                                    }}
                                >
                                <Image
                                    style={{width:60,height:60,borderRadius:5,backgroundColor:'white'}}
                                    source={{uri:posts[data.index].val.DescriptionPhoto}}
                                />
                                <View style={{}}>
                                    <Text style={styles(width, height).textTitle} >{posts[data.index].val.Title}</Text>
                                    <Text style={styles().textTime} >{posts[data.index].val.CreateAtDate}</Text>
                                </View> 
                                </TouchableOpacity> 
                                :
                                null
                            :null
                        }
                        showsVerticalScrollIndicator={false}
                    />}  
                </View>
            </View>
        </SafeAreaView>
    )
}
const styles =(width, height)=> StyleSheet.create({
    container:{
        paddingHorizontal:10,
    },
    header: {
        position:'relative',
        paddingVertical:10,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'#333'
    },
    Avatar:{
        width:150,
        height:150,
        borderRadius:500
    },
    textHeader:{
        fontSize:24,
        fontWeight:'700',
        color:'black',
        paddingVertical:10,
        textAlign: 'center'
    },
    body:{
        paddingHorizontal:15,
    },
    Info:{
        backgroundColor:'#ddd',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:15
    },
    textInfo:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#ddd',
        paddingVertical:5,
        fontWeight:'500'
    },
    Bottom:{
        paddingVertical:10,
    },
    textButton:{
        color:'white',
        fontWeight:'600',
        textAlign:'center'
    },
    editButton:{
        position:'absolute',
        bottom:20,
        right:width/4,
        justifyContent:'center',
        alignItems: 'center',
        borderRadius:1000,
    },
    btnSignOut:{
        backgroundColor:'#2596be',
        width:'100%',
        paddingHorizontal:50,
        paddingVertical:10,
        borderRadius:8,
    },
    btnSaveList:{
        backgroundColor:'green',
        width:'100%',
        paddingHorizontal:50,
        paddingVertical:10,
        borderRadius:8,
    },
    postItem:{
        position:'relative',
        flexDirection:'row',
        backgroundColor:'#D6DBDF',
        marginVertical:5,
        borderRadius:10,
        padding:5,
        elevation:2,
    },
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
})
export default SaveListScreen