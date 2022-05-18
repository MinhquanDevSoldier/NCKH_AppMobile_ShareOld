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
    Alert,
    TextInput
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import MapView from 'react-native-maps';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import NormalAlert from '../../components/modals/NormalAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import {onValue,set} from 'firebase/database';
import {db,auth} from '../../firebase/config'
import styles from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';
import data from '../../assets/LocalAddress/local.json';
import {update,ref,push,child} from 'firebase/database'

const {width, height} = Dimensions.get('window');
const PostDetailEdit = ({navigation,route})=>{
    //value
    const Location = data;
    const notes = 'Lưu ý:\nKhông nên chuyển khoản hay thanh toán trước khi chưa nhận được vật phẩm, tránh các trường hợp lừa đảo qua mạng.';
    const uid = auth.currentUser == null ? '' : auth.currentUser.uid;
    const [message,setMessage] = useState('');
    const [ptitle,setPtitle] = useState('');
    const [pcontent,setPcontent] = useState('');
    const [inputDescriptionPhoto,setInputDescriptionPhoto] = useState('');
    const [selectedDistrict,setSelectedDistrict] = useState('');
    const [selectedWard,setSelectedWard] = useState('');
    const [selectedProvince,setSelectedProvince] = useState('');

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

    console.log(keyPost);
    //Functions
    const addPost = ()=>{
        if(ptitle == '')
        {
            setMessage('Hãy nhập gì đó ở tiêu đề');
        }
        else if(ptitle.length < 15)
        {
            setMessage('Tiêu đề quá ngắn');
        }
        else if(pcontent == '')
        {
            setMessage('Hãy nhập gì đó ở nội dung');
        }
        else if(pcontent.length <15)
        {
            setMessage('Nội dung quá ngắn');
        }
        else if(inputDescriptionPhoto == '')
        {
            setMessage('Bạn ơi chưa có ảnh mô tả kìa')
        }
        else if(selectedProvince == '')
        {
            setMessage('Bạn vui lòng cung cấp ít nhất là tên Tỉnh');
        }
        else
        {
            const location = selectedWard == '' ? 
                                selectedDistrict == '' ? 
                                    selectedProvince 
                                    :selectedDistrict+', '+selectedProvince 
                            :selectedWard+', '+selectedDistrict+', '+selectedProvince
            const postData = {
                Location:location,
                DescriptionPhoto:inputDescriptionPhoto,
                typePost:postDetail.typePost,
                Title:ptitle,
                Content:pcontent,
                CreateAtDate:postDetail.CreateAtDate,
                CreateAtTime:postDetail.CreateAtTime,
                CreateBy:uid,
            };
            console.log(postData);
            //const newPostKey = push(child(ref(db), 'Posts')).key; //Get new ID
            const updates = {};
            updates['Posts/'+keyPost] = postData;
            update(ref(db), updates);
            
            setMessage('Hoàn tất cập nhật');
        }
        setModalVisible(!modalVisible);
    }
    const dialCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
     };
     const getImageFromCamera= async()=>{
        const options={
            storageOptions: {
                path: 'images',
                mediaType:'photo',
            },
            includeBase64:true,
        };

        await launchCamera(options,response=>{
            if(response.didCancel)
            {
                console.log('User cancelled image picker');
            } 
            else if(response.error)
            {   
                console.log('Image picker error: ' + response.error);
            }
            else if(response.customButton)
            {
                console.log('Image picker custom button'+ response.customButton);
            }
            else
            {
                const result = response.assets;
                const source = 'data:'+result[0].type+';base64,' + result[0].base64;
                setInputDescriptionPhoto(source)
            }
        });
    }
    const getImageFromLibrary= ()=>{
        const options={
            storageOptions: {
                path:'images', 
                mediaType:'photo',
            },
            includeBase64:true,
        };

        launchImageLibrary(options,response=>{
            if(response.didCancel)
            {
                console.log('User cancelled image picker');
            } 
            else if(response.error)
            {   
                console.log('Image picker error: ' + response.error);
            }
            else if(response.customButton)
            {
                console.log('Image picker custom button'+ response.customButton);
            }
            else
            {
                var result = response.assets;
                const source = 'data:'+result[0].type+';base64,' + result[0].base64;
                //console.log(source);
                setInputDescriptionPhoto(source);
            }
        });
    }
    const updatePost = (title,content)=>{
        if(title == '' && content == '')
        {
            //navigation.goBack();
        }
        else{
            Alert.alert(
                "Xác nhận",
                "Các thông tin đã nhập sẽ được cập nhật, vui lòng xác nhận !",
                [
                    {
                    text: "Hủy",
                    style: "cancel"
                    },
                    { text: "Đồng ý", onPress: () =>
                        addPost()
                    }
                ]
            )
        }   
    }
    //useEffect
    useEffect(()=>{
        onValue(ref(db,'users/'+UserPostID),(snapshot)=>{
            snapshot.val() == null ? setUserPost([]) : setUserPost(snapshot.val());
            //snapshot.val() == null ? setInputDescriptionPhoto(snapshot.val().DescriptionPhoto):setInputDescriptionPhoto('https://yesoffice.com.vn/wp-content/themes/zw-theme//assets/images/default.jpg');
        })
    },[])
    useEffect(()=>{
        onValue(ref(db,'Posts/'+keyPost),(snapshot)=>{
            SetPostDetail(snapshot.val());
            //console.log(snapshot.val().Title);
            if(snapshot.val() != null){
                setPtitle(snapshot.val().Title);
                setPcontent(snapshot.val().Content);
                setInputDescriptionPhoto(snapshot.val().DescriptionPhoto);
                const arrLocation = snapshot.val().Location.toString().split(',');
                if(arrLocation.length == 1)
                {
                    setSelectedProvince(arrLocation[0].toString().trim());
                }
                else if(arrLocation.length == 2)
                {
                    setSelectedDistrict(arrLocation[0].toString().trim());
                    setSelectedProvince(arrLocation[1].toString().trim());
                }
                else if(arrLocation.length == 3)
                {
                    setSelectedWard(arrLocation[0].toString().trim());
                    setSelectedDistrict(arrLocation[1].toString().trim());
                    setSelectedProvince(arrLocation[2].toString().trim());
                }
            } 
            else {
                setInputDescriptionPhoto('https://yesoffice.com.vn/wp-content/themes/zw-theme//assets/images/default.jpg');
            }

        })
    },[])

    //Main
    return(
        <SafeAreaView>
                        <View style={{
                            height : height*1/14,
                            justifyContent: 'center',
                            //alignItems:'flex-start',
                            backgroundColor:'#2596be',
                            shadowColor: 'black',
                            shadowOpacity: 0.26,
                            shadowOffset: { width: 0, height: 5},
                            shadowRadius: 10,
                            elevation: 5,
                            paddingHorizontal:10
                            }}>
                            <Text style={{
                                fontWeight: "bold",
                                paddingVertical:10,
                                textAlign: 'center',
                                fontSize:16,
                                Color: 'white'
                                }}>CHỈNH SỬA BÀI ĐĂNG
                            </Text>
                        </View>
                <View
                    style={styles().container}
                >
                <ScrollView
                    style={{ paddingTop:10}}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        resizeMode='cover'
                        style={{width:width-20,height:width-20,borderRadius:5}}
                        source={{uri:inputDescriptionPhoto}}
                    />
                    <View
                            style={{
                                flexDirection:'row',
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    borderRadius:5,
                                    paddingHorizontal:20,
                                    paddingVertical:10,
                                    marginTop:10,
                                    width:width/2-10,
                                    marginHorizontal:5,
                                    backgroundColor:'#3b8ba5',
                                }}
                                onPress={getImageFromCamera}
                            >
                                <Text style={{color:'#ffff',fontWeight:'700',textAlign: 'center'}}>Máy ảnh</Text>
                            </TouchableOpacity>    
                            <TouchableOpacity
                                style={{
                                    borderRadius:5,
                                    paddingHorizontal:20,
                                    paddingVertical:10,
                                    marginTop:10,
                                    width:width/2-10,
                                    marginHorizontal:5,
                                    backgroundColor:'#3b8ba5',
                                }}
                                onPress={getImageFromLibrary}
                            >
                                <Text style={{color:'#ffff',fontWeight:'700',textAlign:'center'}}>Thư viện ảnh</Text>
                            </TouchableOpacity>    
                        </View>
                    <View style={styles().contentBox}>
                        <Text style={styles().textTitle}>Tiêu đề:</Text>
                        <TextInput
                            style={{
                                height: 40,
                                //borderRadius:6,
                                margin: 12,
                                borderWidth: 0.1,
                                padding: 10,
                                elevation:1,
                            }}
                            onChangeText={setPtitle}
                            value={ptitle}/>
                    </View>
                    <View style={styles(postDetail.Content == null?0:postDetail.Content.toString().length).contentBox}>
                        <Text style={styles().textContent} >
                            Nội dung:
                        </Text>
                        <TextInput
                            style={{
                                textAlignVertical:'top',
                                height: height/3,
                                //borderRadius:6,
                                margin: 12,
                                borderWidth: 0.1,
                                padding: 10,
                                elevation:1
                            }}
                            onChangeText={setPcontent}
                            multiline={true}
                            value={pcontent}/>
                    </View>
                    <View style={[styles().contentBox,styles().contentBox3]}>
                        <Icon
                            name='map-marker-alt' 
                            style={{
                                paddingLeft:5,
                                paddingRight:15,
                                textAlign: 'justify',
                                fontSize: 20,
                                color: '#154360'
                            }}    
                        />
                        <Text style={[styles().textContent,styles().textLocation]} >
                            {postDetail.Location == null ? '':postDetail.Location.toString()}
                        </Text>
                    </View>
                    <Text
                        style={{fontSize:16,paddingBottom:10,fontWeight:'bold'}}
                    >Địa chỉ liên hệ</Text>
                    <Picker
                        style={{
                            backgroundColor:'white',
                            width:width-10,
                            elevation:1
                        }}
                        selectedValue={selectedProvince}
                        onValueChange={(itemValue, itemIndex) =>
                        setSelectedProvince(itemValue)
                    }>
                        <Picker.Item style={{fontSize:14}} label={'Chưa chọn'} value={''}/>
                        {
                            Location.map(e=>
                                <Picker.Item style={{fontSize:14}} label={e.name} value={e.name}/>
                            )
                        }
                    </Picker>
                    <Picker
                        style={{
                            backgroundColor:'white',
                            width:width-10,
                            marginTop:5,
                            elevation:1
                        }}
                        selectedValue={selectedDistrict}
                        onValueChange={(itemValue, itemIndex) =>
                        setSelectedDistrict(itemValue)
                    }>
                        <Picker.Item style={{fontSize:14}} label={'Chưa chọn'} value={''}/>
                        {
                            Location.map(e=>
                                e.name == selectedProvince ?
                                e.districts.map(District=>
                                    <Picker.Item style={{fontSize:14}} label={District.name} value={District.name}/>
                                )
                                :null
                            )
                        }
                    </Picker>
                    <Picker
                        style={{
                            backgroundColor:'white',
                            width:width-10,
                            marginTop:5,
                            elevation:1
                        }}
                        selectedValue={selectedWard}
                        onValueChange={(itemValue, itemIndex) =>
                        setSelectedWard(itemValue)
                    }>
                        <Picker.Item style={{fontSize:14}} label={'Chưa chọn'} value={''}/>
                        {
                            Location.map(e=>
                                e.name == selectedProvince ?
                                e.districts.map(District=>
                                    District.name == selectedDistrict ?
                                    District.wards.map(Ward=>
                                        <Picker.Item style={{fontSize:14}} label={Ward.name} value={Ward.name}/>
                                    )
                                    :null
                                )
                                :null
                            )
                        }
                    </Picker>
                    <View
                        style={{height:200,paddingTop:10}}
                    >
                        <TouchableOpacity
                            onPress={async()=>{
                                console.log("Ua gi da");
                                updatePost(ptitle,pcontent);
                            }}
                            style={stylesBase().btnSaveList}
                        >
                            <Text style={ stylesBase().textButton}>Cập nhật</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/* //Cần cấp quyền */}
                    {/* <MapView
                    style={{width:width-20,height:width}}
                    initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                /> */}
                </View>
            <NormalAlert
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                content={message}
            />
        </SafeAreaView>
    )
}
const stylesBase =(width, height)=> StyleSheet.create({
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
export default PostDetailEdit