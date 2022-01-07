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
    Alert
} from 'react-native'
const {width, height} = Dimensions.get('window')
const AddPostModal = (props) => {
    const modalVisible = props.modalVisible;
    const [ptitle,setPtitle] = useState('');
    const [pcontent,setPcontent] = useState('');
    const addPost = ()=>{
        props.setModalVisible(!props.modalVisible);
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
                    props.setModalVisible(!props.modalVisible)
                }
            ]
        )
    }
    return(
    <View style={modalStyles(props.modalVisible).centeredView}
    >
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
        >
            <ScrollView showVerticalScroll={false}>
            <View style={modalStyles().centeredView}>
                <View style={modalStyles().modalView}>
                    <Text style={{fontWeight:'bold',color:'#333',paddingVertical:10}}>Đăng bài</Text>
                    <TextInput
                        value={ptitle}
                        onChangeText={setPtitle}
                        style={modalStyles().inputTitle}
                        placeholder="Tiêu đề ..."
                    />
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
                
            </View>
            </ScrollView>
        </Modal>
    </View>
    )
}
const modalStyles = (props) => StyleSheet.create({
    centeredView:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'rgba(255,255,255,0.7)',
    },
    modalView:{
        width:width,
        height:height-20,
        backgroundColor: "white",
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
        borderRadius:8,
        paddingHorizontal:20,
        paddingVertical:5,
        marginTop:10,
        width:width/3,
        marginHorizontal:10,
    },
    inputTitle:{
        fontWeight:'bold',
        color:'black',
        elevation:1,
        width:width - 60,
        paddingHorizontal:16,
        paddingVertical:12,
    },
    inputStyle:{
        elevation:1,
        width:width - 60,
        height:height-200,
        paddingHorizontal:16,
        paddingVertical:16,
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
export default AddPostModal