import React,{useState} from "react"
import{
    SafeAreaView,
    View,
    FlatList,
    Image,
    TextInput,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    Animated,
    TouchableOpacity,
    Modal,
    Alert,
    Button,
} from 'react-native'
import NormalAlert from '../../components/modals/NormalAlert'
import {Picker} from '@react-native-picker/picker';
import {db,auth} from '../../firebase/config'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {update,ref,push,child} from 'firebase/database'
import data from '../../assets/LocalAddress/local.json'
const {width, height} = Dimensions.get('window')

const AddPostScreen = ({navigation}) => {
    //Variables
    const Location = data;
    const [modalVisible,setModalVisible] = useState(false);
    const [message,setMessage] = useState('');
    const [inputDescriptionPhoto,setInputDescriptionPhoto] = useState('https://yesoffice.com.vn/wp-content/themes/zw-theme//assets/images/default.jpg');
    const uid = auth.currentUser == null ? '' :auth.currentUser.uid;
    const [ptitle,setPtitle] = useState('');
    const [pcontent,setPcontent] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(()=>'Mobile');
    const [selectedDistrict,setSelectedDistrict] = useState('');
    const [selectedWard,setSelectedWard] = useState('');
    const [selectedProvince,setSelectedProvince] = useState('');
    
    //UseEffect

    //Functions
    const addPost = (title, content)=>{
        if(title == '')
        {
            setMessage('Hãy nhập gì đó ở tiêu đề');
        }
        else if(title.length < 15)
        {
            setMessage('Tiêu đề quá ngắn');
        }
        else if(content == '')
        {
            setMessage('Hãy nhập gì đó ở nội dung');
        }
        else if(content.length <15)
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
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds();
            const postData = {
                Location:location,
                DescriptionPhoto:inputDescriptionPhoto,
                typePost:selectedLanguage,
                Title:ptitle,
                Content:pcontent,
                CreateAtDate:date+'/'+month+'/'+year,
                CreateAtTime:hours+":"+min+":"+sec,
                CreateBy:uid,
            };
            const newPostKey = push(child(ref(db), 'Posts')).key;
            const updates = {};
            updates['Posts/'+newPostKey] = postData;
            update(ref(db), updates);
            
            setMessage('Bài viết đã được đăng lên hệ thống');
            setPcontent('');
            setPtitle('');
            setInputDescriptionPhoto('https://yesoffice.com.vn/wp-content/themes/zw-theme//assets/images/default.jpg');
            setSelectedProvince('Chưa chọn');
        }
        setModalVisible(!modalVisible);
    }
    const cancelPost = (title,content)=>{
        if(title == '' && content == '')
        {
            navigation.goBack();
        }
        else{
            Alert.alert(
                "Xác nhận",
                "Các thông tin đã nhập sẽ bị xóa, bạn vẫn muốn hủy bài đăng ?",
                [
                    {
                    text: "Hủy",
                    style: "cancel"
                    },
                    { text: "Đồng ý", onPress: () =>
                        navigation.goBack()
                    }
                ]
            )
        }   
    }
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
                const imgheight = result[0].height;
                const imgwidth = result[0].width;
                if(imgheight != imgwidth)
                {
                    
                }
                setInputDescriptionPhoto(source);
            }
        });
    }

    return(
    <SafeAreaView style={modalStyles().centeredView}>
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
            <View style={modalStyles().centeredView}>
                <View style={modalStyles().modalView}>
                    <Text style={{
                        position: 'absolute',
                        top:10,
                        zIndex:99,
                        backgroundColor:'#333',
                        borderRadius:5,
                        paddingVertical:10,
                        textAlign: 'center',
                        width:width-10,
                        marginBottom:10,
                        fontWeight:'bold',
                        color:'#ffff',
                        paddingVertical:10,
                        fontSize:20}}>ĐĂNG BÀI</Text>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    //showsHorizontalScroll={false}    
                    style={{marginTop:70}}
                >
                    <Picker
                        style={{
                            backgroundColor:'white',
                            width:width-10,
                            elevation:2
                        }}
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }>
                        <Picker.Item style={{fontSize:14}} label="Điện thoại" value="Mobile" />
                        <Picker.Item style={{fontSize:14}} label="Máy tính" value="Laptop" />
                        <Picker.Item style={{fontSize:14}} label="Quần áo" value="Clothes"/>
                        <Picker.Item style={{fontSize:14}} label="Phụ kiện" value="Accessory"/>
                        <Picker.Item style={{fontSize:14}} label="Thú cưng" value="Pet"/>
                        <Picker.Item style={{fontSize:14}} label="Đồ gia dụng" value="Houseware"/>
                    </Picker>
                    <TextInput
                        value={ptitle}
                        onChangeText={setPtitle}
                        style={modalStyles().inputTitle}
                        placeholder="Tiêu đề ..."
                    />
                    <View style={{
                        //backgroundColor:'blue',
                        width:width-30,
                        //flexDirection:'row',
                        //justifyContent: 'flex-start',
                        alignItems:'center',
                        //paddingLeft:5
                    }}>
                        <Text style={{fontWeight:'800',marginBottom:10}}>Hình ảnh mô tả</Text>
                        <Image 
                            style={{
                                width: width-10,height:inputDescriptionPhoto == '' ? 10 :width-10,
                            }}
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

                    </View>
                    
                    <TextInput
                        value={pcontent}
                        onChangeText={setPcontent}
                        style={modalStyles().inputStyle}
                        placeholder="Viết gì đó ..."
                        multiline={true}
                    />
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
                        style={{height:80}}
                    >

                    </View>
                    </ScrollView>
                    <View
                        style={{
                            
                            flexDirection:'row',
                            position:'absolute',
                            backgroundColor:'white',
                            bottom: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={()=>addPost(ptitle,pcontent)} 
                            style={[modalStyles().button,modalStyles().btnPost]}>
                            <Text style={modalStyles().textStyle}>Đăng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>cancelPost(ptitle,pcontent)} 
                            style={[modalStyles().button,modalStyles().btnCancel]}>
                            <Text style={modalStyles().textStyle}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <NormalAlert
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    content={message}
                />
            </View>
        }
        
    </SafeAreaView>
    )
}
const modalStyles = (props) => StyleSheet.create({
    centeredView:{
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor:'blue',
    },
    modalView:{
        width:width,
        //height:height-20,
        backgroundColor: '#EAEDED',
        justifyContent:'center',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    btnCancel:{
        backgroundColor:'#e8353c'
    },
    btnPost:{
        backgroundColor:'#333',
    },
    button:{
        borderRadius:5,
        paddingHorizontal:20,
        paddingVertical:10,
        marginTop:10,
        width:width/2-10,
        marginHorizontal:5,
    },
    inputTitle:{
        backgroundColor:'white',
        fontWeight:'bold',
        color:'black',
        elevation:1,
        width:width - 10,
        height: 40,
        marginVertical:10,
        paddingBottom:5,
        paddingTop:10,
        paddingHorizontal:10,
        borderRadius:5
    },
    inputStyle:{
        backgroundColor:'white',
        marginVertical:10,
        borderRadius:5,
        elevation:1,
        width:width - 10,
        height:height-450,
        paddingHorizontal:10,
        paddingVertical:15,
        textAlignVertical: "top",
    },
    textStyle:{
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText:{
        marginBottom: 15,
        textAlign: "center"
    }
})
export default AddPostScreen