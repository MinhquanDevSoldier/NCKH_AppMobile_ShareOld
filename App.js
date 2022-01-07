import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from './src/app/containers/ChatListScreen'; 
import ChatScreen from './src/app/containers/chatScreen';
import LoginScreen from './src/app/containers/LoginScreen';
import RegisterScreen from './src/app/containers/RegisterScreen';
import MainScreen from './src/app/containers/MainScreen';
import AddPostScreen from './src/app/containers/AddPostScreen';
import PostListScreen from './src/app/containers/PostList';
import PostDetailScreen from './src/app/containers/PostDetailScreen';
import HomeScreen from './src/app/containers/HomeScreen';

const Stack = createNativeStackNavigator();

const App =()=>{
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
          <Stack.Screen name="MainScreen" component={MainScreen}/>
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
