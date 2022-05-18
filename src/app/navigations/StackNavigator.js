import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WaitingScreen from '../screens/WaittingScreen/WaitingScreen';
import ChatListScreen from '../screens/ListScreen/ChatListScreen'; 
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import AddPostScreen from '../screens/AddPostScreen/AddPostScreen';
import PostListScreen from '../screens/ListScreen/PostList';
import PostDetailScreen from '../screens/PostDetailScreen/PostDetailScreen';
import ModifyProfile from '../screens/ModifyProfile/ModifyProfile';
import MainTabNavigator from '../navigations/MainTabNavigator';
import SaveListScreen from '../screens/SaveListScreen/SaveListScreen';
import PostDetailEdit from '../screens/PostDetailEditScreen/PostDetailEditScreen';
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
          <Stack.Screen name="WaitingScreen" component={WaitingScreen}/>
          <Stack.Screen name="MainTabNavigator" component={MainTabNavigator}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
          <Stack.Screen name="ModifyProfile" component={ModifyProfile}/>
          <Stack.Screen name="AddPostScreen" component={AddPostScreen}/>
          <Stack.Screen name="PostListScreen" component={PostListScreen}/> 
          <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
          <Stack.Screen name="ChatScreen" component={ChatScreen}/>
          <Stack.Screen name="ChatList" component={ChatListScreen}/>
          <Stack.Screen name="SaveListScreen" component={SaveListScreen}/>
          <Stack.Screen name="PostDetailEdit" component={PostDetailEdit}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App
