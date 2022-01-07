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
import NormalAlert from '../components/modals/NormalAlert'
import {Picker} from '@react-native-picker/picker';
import {db,auth} from '../firebase/config'
import {update,ref,push,child} from 'firebase/database'
const {width, height} = Dimensions.get('window')

const AddPostScreen = ({navigation}) => {
    const [modalVisible,setModalVisible] = useState(false);
    const uid = auth.currentUser.uid;
    const [ptitle,setPtitle] = useState('');
    const [pcontent,setPcontent] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(()=>'Mobile');
    const addPost = ()=>{
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds();
        console.log(date+'/'+month+'/'+year);
        console.log(hours+":"+min+":"+sec);
        const postData = {
            Title:ptitle,
            Content:pcontent,
            CreateAtDate:date+'/'+month+'/'+year,
            CreateAtTime:hours+":"+min+":"+sec,
            CreateBy:uid,
        };
        const newPostKey = push(child(ref(db), 'Posts/'+selectedLanguage)).key;
        const updates = {};
        updates['Posts/'+selectedLanguage+'/'+newPostKey] = postData;
        setModalVisible(!modalVisible);
        setPcontent('');
        setPtitle('');
        return update(ref(db), updates);
    }
    const cancelPost = ()=>{
        Alert.alert(
            "Xác nhận",
            "Các thông tin đã nhập sẽ bị xóa, bạn vẫn muốn hủy bài đăng ?",
            [
                {
                text: "Hủy",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
                },
                { text: "Đồng ý", onPress: () =>
                    navigation.goBack()
                }
            ]
        )
    }
    return(
    <SafeAreaView style={modalStyles().centeredView}
    >
        <ScrollView showVerticalScroll={false}>
            <View style={modalStyles().centeredView}>
                <View style={modalStyles().modalView}>
                    <Text style={{
                        backgroundColor:'#333',
                        borderRadius:5,
                        paddingVertical:10,
                        textAlign: 'center',
                        width:width-60,
                        marginBottom:10,
                        fontWeight:'bold',
                        color:'#ffff',
                        paddingVertical:10,
                        fontSize:20}}>ĐĂNG BÀI</Text>
                    <Picker
                        style={{
                            backgroundColor:'white',
                            width:width-66,
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
                        width:width-60,
                        flexDirection:'row',
                        justifyContent: 'flex-start',
                        alignItems:'center',
                        paddingLeft:5
                    }}>
                        <Text style={{fontWeight:'800',}}>Hình ảnh :</Text>
                        <TouchableOpacity
                            style={{
                                marginStart:10,
                                backgroundColor:'#333',
                                paddingVertical:5,
                                paddingHorizontal:20,
                                borderRadius:5
                            }}
                        >
                            <Text style={{color:'#ffff',fontWeight:'700'}}>Thêm</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TextInput
                        value={pcontent}
                        onChangeText={setPcontent}
                        style={modalStyles().inputStyle}
                        placeholder="Viết gì đó ..."
                        multiline={true}
                    />
                    <View
                        style={{
                            flexDirection:'row'

                        }}
                    >
                        <TouchableOpacity
                            onPress={addPost} 
                            style={[modalStyles().button,modalStyles().btnPost]}>
                            <Text style={modalStyles().textStyle}>Đăng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={cancelPost} 
                            style={[modalStyles().button,modalStyles().btnCancel]}>
                            <Text style={modalStyles().textStyle}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <NormalAlert
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    content='Bài viết của bạn đã được đăng lên hệ thống.'
                />
            </View>
        </ScrollView>
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
        height:height-20,
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
        width:width/2.5,
        marginHorizontal:10,
    },
    inputTitle:{
        backgroundColor:'white',
        fontWeight:'bold',
        color:'black',
        elevation:1,
        width:width - 60,
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
        width:width - 60,
        height:height-350,
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