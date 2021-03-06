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
    //function
    // const getCurrentUser = async () => {
    //     try {
    //       const {user} = await GoogleSignin.getCurrentUser();
    //       console.log(user);
    //       setUid(user.id.toString());
    //       SetUserInfo(user);
    //     } catch (error) {
    //       if (error.code === statusCodes.SIGN_IN_REQUIRED) {
    //         // user has not signed in yet
    //       } else {
    //         console.log(error);
    //       }
    //     }
    // };

    const signOut_Google = async () => {
        try {
          await auth.signOut();
          await GoogleSignin.signOut();
        } catch (error) {
          console.error(error);
        }
      };
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
                            B???n c???n ????ng nh???p tr?????c khi d??ng t??nh n??ng n??y
                        </Text>
                        <View style={ styles().Bottom }>
                            <TouchableOpacity
                                onPress={async()=>{
                                    await signOut_Google();
                                    await auth.signOut();
                                    navigation.navigate('LoginScreen')
                                }}
                                style={styles().btnSignOut}
                            >
                                <Text style={ styles().textButton}>????ng nh???p</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View>
                        <View style={styles().header}>
                            <Image
                                style={styles().Avatar}
                                resizeMode='cover'
                                source={{uri:userInfo.photo}}
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
                        <Text style={styles().textHeader}>{`${userInfo.name}`}</Text>
                        <View style={styles().container}></View>
                        <View style={ styles().body}>
                        <View style={ styles().Bottom }>
                            <TouchableOpacity
                                onPress={async()=>{
                                    await signOut_Google();
                                    await auth.signOut();
                                    navigation.replace('LoginScreen')
                                }}
                                style={styles().btnSignOut}
                            >
                                <Text style={ styles().textButton}>????ng xu???t</Text>
                            </TouchableOpacity>
                        </View> 
                    <View style={styles().Info}>
                        <Text style={styles().textInfo}>
                            <FontAwesomeIcon size={18} icon={ faCalendarAlt } />{`  Ng??y tham gia : ${userInfo.createAt}`}
                        </Text>
                        <Text style={styles().textInfo}>
                            <FontAwesomeIcon size={18} icon={ faMapMarkerAlt } />{`  ?????a ch??? : ${userInfo.address}`}
                        </Text>
                        <Text style={styles().textInfo}>
                            <FontAwesomeIcon size={18} icon={ faPhone } />{`  S??? ??i???n tho???i : ${userInfo.phone == '' ?'Ch??a c???p nh???t':userInfo.phone}`}
                        </Text>
                        <TouchableOpacity
                                onPress={async()=>{
                                    navigation.navigate('SaveListScreen');
                                }}
                                style={styles().btnSaveList}
                            >
                                <Text style={ styles().textButton}>B??i vi???t ???? l??u</Text>
                            </TouchableOpacity>
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

export default ProfileScreen;