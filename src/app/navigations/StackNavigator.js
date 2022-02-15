import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screens/ListScreen/ChatListScreen'; 
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import AddPostScreen from '../screens/AddPostScreen/AddPostScreen';
import PostListScreen from '../screens/ListScreen/PostList';
import PostDetailScreen from '../screens/PostDetailScreen/PostDetailScreen';
import ModifyProfile from '../screens/ModifyProfile/ModifyProfile';
import MainTabNavigator from '../navigations/MainTabNavigator';
import TestFirebase from '../screens/TestFirebase'
const Stack = createNativeStackNavigator();

const App =()=>{
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
          {/* <Stack.Screen name='TestFirebase' component={TestFirebase} /> */}
          <Stack.Screen name="MainTabNavigator" component={MainTabNavigator}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
          
          <Stack.Screen name="ModifyProfile" component={ModifyProfile}/>
          <Stack.Screen name="AddPostScreen" component={AddPostScreen}/>
          <Stack.Screen name="PostListScreen" component={PostListScreen}/> 
          <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
          <Stack.Screen name="ChatScreen" component={ChatScreen}/>
          <Stack.Screen name="ChatList" component={ChatListScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App
