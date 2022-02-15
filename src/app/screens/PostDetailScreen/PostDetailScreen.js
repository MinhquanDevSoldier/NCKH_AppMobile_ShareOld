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
import NormalAlert from '../../components/modals/NormalAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import {onValue,ref,set} from 'firebase/database';
import {db,auth} from '../../firebase/config'
import styles from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width, height} = Dimensions.get('window');
const PostDetail = ({navigation,route})=>{
    //value
    const uid = auth.currentUser == null ? '' : auth.currentUser.uid;
    const [message,setMessage] = useState('');
    //Boolean 
    const [modalVisible,setModalVisible] = useState(false);
    const [markSave,setMarkSave] = useState(false);

    //Array 
    const [saveList,setSaveList] = useState([]);
    //Object
    const User = auth.currentUser;
    const [postDetail,SetPostDetail] = useState({});
    const [userPost,setUserPost] = useState({});
    
    //Get value from prev Screen
    const keyPost = route.params.keyPost;
    const Type = route.params.Type;
    const UserPostID = route.params.userPostID;

    //Functions
    const dialCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
     };

    //useEffect
    useEffect(()=>{
        onValue(ref(db,'users/'+UserPostID),(snapshot)=>{
            snapshot.val() == null ? setUserPost([]) : setUserPost(snapshot.val());
        })
    },[])
    useEffect(()=>{
        onValue(ref(db,'Posts/'+keyPost),(snapshot)=>{
            SetPostDetail(snapshot.val());
        })
    },[])
    useEffect(()=>{
        onValue(ref(db,'SaveList/'+uid),(snapshot)=>{
            if(uid != '')
                snapshot.val() == null ? setSaveList([]) : setSaveList(snapshot.val());
        })
    },[])
    //Main
    return(
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{paddingHorizontal:10}}
                >
                    <View
                        style={{
                            alignSelf:'flex-end'
                        }}
                    >
                        <View
                            style={styles().optionTopBar}
                        >
                            <TouchableOpacity
                                onPress={()=>{
                                    if(uid == '')
                                    {
                                        setMessage('Bạn cần đăng nhập để có thể lưu bài viết');
                                        setModalVisible(!modalVisible)
                                    }
                                    else if(User.uid == UserPostID)
                                    {
                                        setMessage('Đây là bài đăng của bạn')
                                        setModalVisible(!modalVisible)
                                    }
                                    else{
                                        var saves = saveList;
                                        if(saves.includes(keyPost))
                                        {
                                            //remove out of Array if not exists keyPost
                                            const index = saves.indexOf(keyPost);
                                            if(index > -1)
                                            {
                                                saves.splice(index, 1);
                                            }
                                        }
                                        else{
                                            //add in Array if not exists keyPost
                                            saves.push(keyPost);
                                        }

                                        set(ref(db, 'SaveList/' + uid), saves);
                                    }
                                    
                                }}
                                style={styles().topIcon}
                            >
                                <Icon
                                    name='heart' 
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 30,
                                        color: saveList.includes(keyPost) ? '#E74C3C':'#154360',
                                    }}
                                />
                            </TouchableOpacity> 
                            <TouchableOpacity
                                onPress={()=>{
                                    if(uid == '')
                                    {
                                        setMessage('Bạn cần đăng nhập để có thể chỉnh sửa bài viết');
                                        setModalVisible(!modalVisible)
                                    }
                                    else if(User.uid == UserPostID)
                                    {
                                        
                                    }
                                    else{
                                        setMessage('Bạn không thể chỉnh sửa bài viết của người khác')
                                        setModalVisible(!modalVisible)
                                    }
                                    
                                }}
                                style={styles().topIcon}
                            >
                                <Icon
                                    name='edit' 
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 30,
                                        color: '#154360'
                                    }}
                                />
                            </TouchableOpacity> 
                        </View>
                    </View>
                    <Image
                        resizeMode='cover'
                        style={{width:width-20,height:200,borderRadius:5}}
                        source={{uri:postDetail.DescriptionPhoto}}
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
                            source={{uri:userPost.Avatar}}
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
                                if (uid == '')
                                {
                                    if(userPost.Phone == "")
                                    {
                                        setMessage('Người dùng này chưa cập nhật số điện thoại')
                                        setModalVisible(!modalVisible)
                                    }
                                }
                                else if(User.uid == UserPostID)
                                {
                                    setMessage('Đây là bài đăng của bạn')
                                    setModalVisible(!modalVisible)
                                }
                                else if(userPost.Phone == "")
                                {
                                    setMessage('Người dùng này chưa cập nhật số điện thoại')
                                    setModalVisible(!modalVisible)
                                }
                                else {
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
                                    color: '#FFFF'
                                }}
                            />
                            <Text style={styles().textPhone} > Điện thoại </Text>
                        </TouchableOpacity>  
                        <TouchableOpacity
                            onPress={()=>{
                                if(uid == '')
                                {
                                    setMessage('Bạn cần đăng nhập để có thể dùng tính năng này');
                                    setModalVisible(!modalVisible);
                                }
                                else if(User.uid == UserPostID)
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
                                    color: '#FFFF'
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

export default PostDetail