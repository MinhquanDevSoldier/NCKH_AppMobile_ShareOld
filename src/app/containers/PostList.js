import React,{useState,useEffect} from "react"
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import {db,auth} from '../firebase/config'
import {onValue,ref} from 'firebase/database'

const {width,height} = Dimensions.get('window');
const PostList = ({navigation,route}) =>{
    const typeList = route.params.val;
    const [Posts,SetPosts] = useState([
        
    ]);
    
    useEffect(()=>{
        const PostRef = ref(db,'Posts/'+typeList);
        onValue(PostRef,(snapshot)=>{
            var getData = [];
            snapshot.forEach((snapshotChild)=>{
                getData.push({
                    key:snapshotChild.key,
                    val:snapshotChild.val()
                })
            })
            SetPosts(getData);
        })
    },[])
    return(
    <SafeAreaView style={{flex: 1}}>
        <View>
            <Text style={{
                backgroundColor:'#2596be',
                fontSize:16,
                fontWeight:'bold',
                elevation:1,
                color:'#FFFF',
                paddingHorizontal:10,
                paddingTop:10,
                paddingBottom:5,
            }}>{route.params.type}</Text>
        </View>
        <View style={{flex:1}}>
            {   
                Posts.length == 0 || Posts == null
                ?
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex:1,
                    }}
                >
                    <Icon
                        name='not-equal' 
                        style={{
                            textAlign: 'center',
                            fontSize: 80,
                            color: '#C5C3C3'
                        }}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16,color: '#C5C3C3'}}
                    >Hiện tại không có bài đăng nào, hãy quay lại sau </Text>
                </View>
                :
                <FlatList
                style={{
                    
                }}
                    data={Posts}
                    renderItem={(data)=>
                        <TouchableOpacity
                            style={styles.postItem}
                            onPress={()=>{
                                navigation.navigate('PostDetailScreen',
                                {
                                    keyPost:Posts[data.index].key,
                                    Type:route.params.val,
                                    userPostID:Posts[data.index].val.CreateBy
                                })
                            }}
                        >
                            <Image
                                style={{width:60,height:60,borderRadius:5,backgroundColor:'white'}}
                                source={{uri:'https://product.hstatic.net/1000300544/product/iphone-12-purple-select-2021_18d38c1f4c614923acae74964b743645.png'}}
                            />
                            <View>
                                <Text style={styles.textTitle} >{Posts[data.index].val.Title}</Text>
                                <Text style={styles.textTime} >{Posts[data.index].val.CreateAtDate}</Text>
                            </View> 
                        </TouchableOpacity>  
                    }
                    showsVerticalScrollIndicator={false}
                />
            }
        </View>
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
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
    postItem:{
        position:'relative',
        flexDirection:'row',
        backgroundColor:'#D6DBDF',
        marginVertical:5,
        marginHorizontal:10,
        borderRadius:10,
        padding:5,
        elevation:2,
    }
})
export default PostList;