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
const {width,height} = Dimensions.get('screen');

const ProfileScreen = ({navigation}) => {
    const uid =  auth.currentUser == null ? '' : auth.currentUser.uid;
    const [userInfo,SetUserInfo] = useState({});
    const [saveList,setSaveList] = useState([]);
    const [posts,setPosts] = useState([]);

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
        onValue(ref(db,'SaveList/'+uid),(snapshot)=>{
            snapshot.val() == null ? setSaveList([]) : setSaveList(snapshot.val());
        })
    },[])
    useEffect(()=>{
        const UserRef = ref(db,'users/'+uid);
        onValue(UserRef,(snapshot)=>{
            const data = snapshot.val();
            SetUserInfo(data);
        })
    },[])

    return(
        <SafeAreaView>
            <ScrollView>
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
                        <View style={ styles().Bottom }>
                            <TouchableOpacity
                                onPress={()=>{
                                    auth.signOut();
                                    navigation.navigate('LoginScreen')
                                }}
                                style={styles().btnSignOut}
                            >
                                <Text style={ styles().textButton}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View>
                        <View style={styles().header}>
                            <Image
                                style={styles().Avatar}
                                resizeMode='cover'
                                source={{uri:userInfo.Avatar}}
                            />
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('ModifyProfile')}}
                                style={styles(width, height).editButton}
                            >
                                <Icon
                                    name='user-edit' 
                                    style={{
                                        fontSize: 30,
                                        color: '#FFFF'
                                    }}
                                />
                            </TouchableOpacity> 
                        </View>
                        <Text style={styles().textHeader}>{`${userInfo.username}`}</Text>
                        <View style={styles().container}></View>
                        <View style={ styles().body}>
                        <View style={ styles().Bottom }>
                            <TouchableOpacity
                                onPress={()=>{
                                    auth.signOut();
                                    navigation.replace('LoginScreen')
                                }}
                                style={styles().btnSignOut}
                            >
                                <Text style={ styles().textButton}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View> 
                    <View style={styles().Info}>
                        <Text style={styles().textInfo}>
                            <FontAwesomeIcon size={18} icon={ faCalendarAlt } />{`  Ngày tham gia : ${userInfo.CreateAt}`}
                        </Text>
                        <Text style={styles().textInfo}>
                            <FontAwesomeIcon size={18} icon={ faMapMarkerAlt } />{`  Địa chỉ : ${userInfo.Address}`}
                        </Text>
                        <Text style={styles().textInfo}>
                            <FontAwesomeIcon size={18} icon={ faPhone } />{`  Số điện thoại : ${userInfo.Phone == '' ?'Chưa cập nhật':userInfo.Phone}`}
                        </Text>
                        </View>
                        <View>
                            <Text style={{
                                fontWeight:'700',
                                paddingVertical:10,
                                fontSize:16
                            }}>Danh sách bài đăng đã lưu ( tối đa 15 )</Text>
                        </View>
                        <View  style={{paddingBottom:150}}>
                        {
                            saveList.length == 0 ?
                            <View style={{paddingVertical:60,alignItems:'center',justifyContent:'center'}}>
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
                                    saveList.includes(posts[data.index].key)?
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
                                    :null
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        }
                        </View>
                        </View>
                    </View>
                }
            </ScrollView>
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

export default ProfileScreen;