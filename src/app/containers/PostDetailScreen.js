import React,{useState,useEffect} from 'react';
import {
    View,
    ScrollView,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Platform,
} from 'react-native'
import NormalAlert from '../components/modals/NormalAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import {onValue,ref} from 'firebase/database';
import {db,auth} from '../firebase/config'
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width, height} = Dimensions.get('window');
const PostDetail = ({navigation,route})=>{
    const [modalVisible,setModalVisible] = useState(false);
    const [message,setMessage] = useState('');
    const keyPost = route.params.keyPost;
    const Type = route.params.Type;
    const User = auth.currentUser;
    const UserPostID = route.params.userPostID;
    const [postDetail,SetPostDetail] = useState({});
    const [userPost,setUserPost] = useState({});
    useEffect(()=>{
        onValue(ref(db,'users/'+UserPostID),(snapshot)=>{
            setUserPost(snapshot.val());
        })
    },[])
    useEffect(()=>{
        onValue(ref(db,'Posts/'+Type+'/'+keyPost),(snapshot)=>{
            SetPostDetail(snapshot.val());
        })
    },[])

    const dialCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
     };

    return(
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{paddingHorizontal:10}}
                >
                    <Image
                        resizeMode='cover'
                        style={{width:width-20,height:200}}
                        source={{uri:'https://vcdn-sohoa.vnecdn.net/2021/11/11/iPhone-5282-1636615544.jpg'}}
                    />
                    <View style={styles().contentBox}>
                        <Text style={styles().textTitle}>{postDetail.Title}</Text>
                    </View>
                    <View style={styles().contentBox}>
                        <Text> Đăng bởi : </Text>
                    <View
                        style={{
                            paddingTop:10,
                            flexDirection:'row',
                            justifyContent: "flex-start",
                            alignItems: "center"
                        }}
                    >
                        <Image
                            style={{
                                width:40,
                                height:40,
                            }}
                            source={{uri:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}}
                        />
                        <Text
                            style={{
                                paddingHorizontal:10,
                                fontSize:20,
                                fontWeight:'600',
                                elevation:2,
                                
                            }}
                        >{userPost == null ? '' : userPost.username}</Text>
                    </View>
                    <Text
                        style={{
                            width:'100%',
                            textAlign:'right',
                        }}
                    >
                        Ngày : {postDetail.CreateAtDate == null ?'':postDetail.CreateAtDate.toString()}
                    </Text>
                    </View>
                    <View style={styles(postDetail.Content == null?0:postDetail.Content.toString().length).contentBox}>
                        <Text style={styles().textContent} >
                            {postDetail.Content == null ? '':postDetail.Content.toString()}
                        </Text>
                    </View>
                    <View style={styles().bottomView} >
                        <TouchableOpacity
                            onPress={()=>{
                                if(User.uid == UserPostID)
                                {
                                    setMessage('Đây là bài đăng của bạn')
                                    setModalVisible(!modalVisible)
                                }
                                else if(userPost.Phone == "")
                                {
                                    setMessage('Người dùng này chưa cập nhật số điện thoại')
                                    setModalVisible(!modalVisible)
                                }
                                else
                                {
                                    dialCall(userPost.Phone)
                                }
                            }}
                            style={[styles().button,styles().buttonPhone]}
                        >
                            <Icon
                                name='phone-alt' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 25,
                                    color: '#008000'
                                }}
                            />
                            <Text style={styles().textPhone} > Điện thoại </Text>
                        </TouchableOpacity>  
                        <TouchableOpacity
                            onPress={()=>{
                                if(User.uid == UserPostID)
                                {
                                    setMessage('Đây là bài đăng của bạn')
                                    setModalVisible(!modalVisible)
                                }
                                else{
                                    let idroom = null;
                                    if(userPost.linkRoom != null)
                                    {
                                        userPost.linkRoom.forEach(element => {
                                        if(element.userPartner == User.uid){
                                                idroom = element.idRoom
                                            }
                                        });
                                    }
                                    
                                    navigation.navigate('ChatScreen',{
                                        idRoom:idroom,
                                        name:userPost.username,
                                        uid2:UserPostID
                                    })
                                }
                                
                            }}
                            style={[styles().button,styles().buttonMessage]}
                        >
                            <Icon
                                name='comment-dots' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 30,
                                    color: '#154360'
                                }}
                            />
                            <Text style={styles().textMessage}> Trò chuyện </Text>
                        </TouchableOpacity>             
                    </View>
                </View>
            </ScrollView>
            <NormalAlert
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                content={message}
            />
        </SafeAreaView>
    )
}
const styles =(sizeContent)=> StyleSheet.create({
    contentBox:{
        backgroundColor:'white',
        marginVertical:4,
        borderRadius:5,
        elevation:2,
        paddingHorizontal:10,
        paddingBottom:sizeContent < 100 ? 50 : 10,
        paddingTop:10,
    },
    textTitle: {
        color:'black',
        fontWeight:'800',
        fontSize:20,
    },
    textContent:{
        color:'black',
        fontWeight:'300',
        fontSize:16,
    },
    bottomView:{
        flex:1,
        flexDirection:'row',
    },
    button:{
        flex:1,
        borderRadius:5,
        elevation:2,
        marginVertical:10,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
    },
    buttonMessage: {
        marginLeft:5,
    },
    buttonPhone:{
        marginRight:5,
    },
    textPhone:{
        fontWeight:'500',
        color:'#008000'
    },
    textMessage:{
        fontWeight:'500',
        color:'#154360'
    }  
})
export default PostDetail