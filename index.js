/**
 * @format
 */

import {LogBox,AppRegistry} from 'react-native';
LogBox.ignoreAllLogs();
import App from './src/app/navigations/StackNavigator';
//import App from './src/app/containers/MainScreen'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
