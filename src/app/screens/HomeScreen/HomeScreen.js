import * as React from "react"
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
    TouchableOpacity
} from 'react-native'
import styles from './styles'
const {width,height} = Dimensions.get('screen')

const HomeScreen = ({navigation})=>{
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX,width);
    const scrollViewRef = React.useRef();
    const [Posts,setPosts] = React.useState([]);

    const SlideImages = [
       "https://inanaz.com.vn/wp-content/uploads/2020/02/mau-banner-quang-cao-dep-1.jpg",
       "https://inanaz.com.vn/wp-content/uploads/2020/02/mau-banner-quang-cao-dep.jpg",
       "https://inanaz.com.vn/wp-content/uploads/2020/02/mau-banner-quang-cao-dep-14.jpg",
       "https://inanaz.com.vn/wp-content/uploads/2020/02/mau-banner-quang-cao-dep-3.jpg"
    ]
    const Categories =[
        {
            id:1,
            icon : 'https://image.freepik.com/free-vector/digital-device-mockup_53876-89354.jpg',
            title:'Điện thoại',
            value: "Mobile"
        },
        {
            id:2,
            icon : 'https://image.freepik.com/free-psd/digital-device-mockup_53876-91374.jpg',
            title:'Laptop',
            value:'Laptop'
        },
        {
            id:3,
            icon : 'https://image.freepik.com/free-vector/white-shirt-template_1132-95.jpg?2',
            title:'Quần áo',
            value: 'Clothes'
        },
        {
            id:4,
            icon : 'https://image.freepik.com/free-vector/headphones_53876-37466.jpg',
            title:'Phụ kiện',
            value:'Accessory'
        },
        {
            id:5,
            icon : 'https://image.freepik.com/free-vector/cute-dog-cute-cat-love-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3686.jpg',
            title:'Thú cưng',
            value:'Pet'
        },
        {
            id:6,
            icon : 'https://image.freepik.com/free-vector/iot-smart-home-remote-controlled-electronic-devices-isometric-icons-collection-with-refrigerator-tv-stove-coffeemaker-illustration_1284-28689.jpg',
            title:'Gia dụng',
            value:'Houseware'
        },
    ]
    return(
        <SafeAreaView
            style={styles().Container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding:5
            }}>
                <TextInput
                    style={styles(width).InputSearch}
                    placeholder="Tìm kiếm"
                />
            </View>
            <View>
                <ScrollView
                   ref = {scrollViewRef}
                   horizontal
                   pagingEnabled
                   showsHorizontalScrollIndicator={false}
                >
                    <View style={{flexDirection:'row'}}>
                        {
                            SlideImages.map((slide,index)=>
                                <Image
                                    key={index}
                                    style={{
                                        width:width-20,
                                        height:200,
                                    }}
                                    resizeMode="stretch"
                                    source={{uri:`${slide}`}}
                                />
                            )
                        }
                    </View>
                </ScrollView>
            </View>
            <View>
                <Text style={styles().titleDoc}>Danh mục</Text>
                <FlatList
                    style={{}}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={Categories}
                    keyExtractor={item => item.id}
                    renderItem={({item})=>(
                        <TouchableOpacity
                            style={{
                                padding:10
                            }}
                            onPress={()=> navigation.navigate('PostListScreen',{type:item.title,val:item.value})}
                        >
                            <Image 
                                style={{width:80,height:80,borderRadius:15}}
                                resizeMode='cover'
                                source={{uri:`${item.icon}`}}
                            />
                            <Text
                                style={{textAlign: 'center',fontWeight:'600'}}
                            >{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View>
                <Text style={styles().titleDoc}>Tin đăng mới</Text>
                {
                    Posts.length == 0 ?
                    <View style={{paddingVertical:60,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{textAlign: 'center'}}>Danh sách rỗng</Text>
                        <Image
                            style={{width:width/2,height:height/3,borderTopRightRadius:5,borderTopLeftRadius:5}}
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
                                style={{width:width-20,height:height/2,borderTopRightRadius:5,borderTopLeftRadius:5}}
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
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen