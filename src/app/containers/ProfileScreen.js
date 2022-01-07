import React,{useState,useEffect} from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCoffee,faCalendarAlt,faMapMarkerAlt,faPhone } from '@fortawesome/free-solid-svg-icons'
import { db,auth } from '../firebase/config'
import {signOut} from 'firebase/auth'
import { ref, onValue} from "firebase/database";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ProfileScreen = ({navigation}) => {
    const uid = auth.currentUser.uid;
    const [userInfo,SetUserInfo] = useState({});
    const [Posts,SetPosts] = useState([]);
    useEffect(()=>{
        const UserRef = ref(db,'users/'+uid);
        onValue(UserRef,(snapshot)=>{
            const data = snapshot.val();
            SetUserInfo(data);
        })
    },[])
    return(
        <SafeAreaView style={profileStyles.container}>
            <ScrollView>
                <View style={profileStyles.header}>
                    <Image
                        style={profileStyles.Avatar}
                        resizeMode='stretch'
                        source={{uri:auth.currentUser.photoURL}}
                    />
                    <Text style={profileStyles.textHeader}>{`${userInfo.username}`}</Text>
                </View>
                <View style={ profileStyles.Bottom }>
                    <TouchableOpacity
                        onPress={()=>{
                            auth.signOut();
                            navigation.replace('LoginScreen')
                        }}
                        style={profileStyles.btnSignOut}
                    >
                        <Text style={ profileStyles.textButton}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
                <View style={profileStyles.body}>
                    <Text style={profileStyles.textInfo}>
                        <FontAwesomeIcon size={18} icon={ faCalendarAlt } />{`  Ngày tham gia : ${userInfo.CreateAt}`}
                    </Text>
                    <Text style={profileStyles.textInfo}>
                        <FontAwesomeIcon size={18} icon={ faMapMarkerAlt } />{`  Địa chỉ : ${userInfo.Address}`}
                    </Text>
                    <Text style={profileStyles.textInfo}>
                        <FontAwesomeIcon size={18} icon={ faPhone } />{`  Số điện thoại : ${userInfo.Phone == '' ?'Chưa cập nhật':userInfo.Phone}`}
                    </Text>
                </View>
                <View>
                    <Text style={{
                        fontWeight:'700',
                        paddingVertical:10,
                        fontSize:16
                    }}>Danh sách bài đăng của bạn</Text>
                </View>
                {
                    Posts.length == 0 ?
                    <View style={{paddingVertical:60,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{textAlign: 'center'}}>Danh sách rỗng</Text>
                        <Image
                            style={{width:windowWidth/2,height:windowHeight/3,borderTopRightRadius:5,borderTopLeftRadius:5}}
                            resizeMode='stretch'
                            source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrsIEnZ-jYZo6lMV0N75P7N0FHeg4FUPQwOw&usqp=CAU'}}
                        />
                    </View>
                    :
                    Posts.map((item,index)=>
                        <TouchableOpacity
                            style={{
                                borderRadius:5,
                                borderColor:'black',
                                borderWidth:0.25,
                                marginBottom:10
                            }}
                        >
                            <Image
                                style={{width:windowWidth-20,height:windowHeight/2,borderTopRightRadius:5,borderTopLeftRadius:5}}
                                resizeMode='stretch'
                                source={{uri:`${item.Image}`}}
                            />
                            <View style={{padding:10}}>
                                <Text style={{fontWeight:'800',color:'black'}}>{item.Title}</Text>
                                <Text stlye={{textAlign:'justify'}}>{item.Content}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}
const {width, height} = Dimensions.get('window')
const profileStyles = StyleSheet.create({
    container:{
        paddingHorizontal:10,
    },
    header: {
        paddingVertical:10,
        justifyContent:'center',
        alignItems: 'center',
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
        paddingVertical:10
    },
    body:{
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
        paddingVertical:10
    },
    textButton:{
        color:'white',
        fontWeight:'600',
        textAlign:'center'
    },
    btnSignOut:{
        backgroundColor:'#2596be',
        width:'100%',
        padding:8,
        borderRadius:8,
    }
})

export default ProfileScreen;