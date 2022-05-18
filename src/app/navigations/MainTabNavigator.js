import React,{useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../screens/HomeScreen/HomeScreen';
import Profile from '../screens/UserProfile/ProfileScreen';
import Chats from '../screens/ListScreen/ChatListScreen';
import ManagePostScreen from '../screens/ManagePostScreen/ManagePostScreen';
import AddPostModal from '../components/AddPostModal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

const {width,height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const SpaceTab = ()=>{
    return(
        <View style={styles.centeredView}>
           
        </View>
    )
}
const AddPostButton = (props)=>(
    <TouchableOpacity
        onPress={()=>{props.navigation.navigate('AddPostScreen')}}
    >
        <View
            style={{
                top:-20,
                elevation:2
            }}
        >
            <Icon
                name='plus-circle' 
                style={{
                    backgroundColor:'white',
                    borderRadius:100,
                    textAlign: 'center',
                    fontSize: 50,
                    elevation:5,
                    color: 'rgb(0,106,255)'
                }}
            />
        </View>
    </TouchableOpacity>
)
const Main = ({navigation})=>{
    return(
            <Tab.Navigator screenOptions={{
                    headerShown:false,
                    tabBarLabelStyle:{
                        //color: 'blue',
                        fontSize:18,
                        fontWeight: '900',
                    },
                    tabBarShowLabel: false,
                    tabBarStyle:{
                        position:'absolute',
                        marginHorizontal:10,
                        bottom:5,
                        elevation:5,
                        borderRadius:10,
                        height:60,
                        backgroundColor:'white',
                        shadowColor:'#000',
                        shadowOpacity:0.06,
                        shadowOffset:{
                            width:20,
                            height:20,
                        }
            }}}>
                <Tab.Screen 
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel:'HOME',
                        tabBarIcon: ({focused})=>
                        <View>
                            <Icon
                                name='home' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 30,
                                    color:focused? 'rgb(0,106,255)':'rgb(118,113,113)',
                                }}
                            />
                            <Text style={{
                                fontSize:10,
                                textAlign: 'center',
                                color:focused? 'rgb(0,106,255)':'rgb(118,113,113)'
                            }}>Trang chủ</Text>
                        </View>,
                    }} 
                />
                <Tab.Screen 
                    name="ManagePost"
                    component={ManagePostScreen}
                    options={{
                        tabBarLabel:'HOME',
                        tabBarIcon: ({focused})=>
                        <View>
                            <Icon
                                name='list-alt' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 30,
                                    color:focused? 'rgb(0,106,255)':'rgb(118,113,113)',
                                }}
                            />
                            <Text style={{
                                fontSize:10,
                                textAlign: 'center',
                                color:focused? 'rgb(0,106,255)':'rgb(118,113,113)'
                            }}>Quản lý bài viết</Text>
                        </View>,
                    }} 
                />
                <Tab.Screen name="postCreen" component={SpaceTab}
                    options={{
                        tabBarIcon: ({focused})=>(
                            <Icon
                                name='plus-circle' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 30,
                                    color: '#ff3300'
                                }}
                            />
                        ),
                        tabBarButton:(props)=>(
                            <AddPostButton 
                                navigation = {navigation}
                            />
                        )
                    }}
                />
                <Tab.Screen 
                    name="Chats"
                    component={Chats}
                    options={{
                        tabBarLabel:'HOME',
                        tabBarIcon: ({focused})=>
                        <View>
                            <Icon
                                name='comment-dots' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 30,
                                    color:focused? 'rgb(0,106,255)':'rgb(118,113,113)',
                                }}
                            />
                            <Text style={{
                                fontSize:10,
                                textAlign: 'center',
                                color:focused? 'rgb(0,106,255)':'rgb(118,113,113)'
                            }}>Trò chuyện</Text>
                        </View>
                    }} 
                />
                <Tab.Screen 
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarLabel:'HOME',
                        tabBarIcon: ({focused})=>
                        <View>
                            <Icon
                                name='user-circle' 
                                style={{
                                    textAlign: 'center',
                                    fontSize: 30,
                                    color:focused? 'rgb(0,106,255)':'rgb(118,113,113)',
                                }}
                            />
                            <Text style={{
                                fontSize:10,
                                textAlign: 'center',
                                color:focused? 'rgb(0,106,255)':'rgb(118,113,113)'
                            }}>Tài khoản</Text>
                        </View>,
                    }} 
                />
            </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    centeredView:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    },
    text:{
        fontWeight:'bold',
        fontSize:36,
    }
})
export default Main