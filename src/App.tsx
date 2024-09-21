import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Notify from "./components/Notifications";
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store';
import ThemeOptions from "./Theme";
import Home from './pages/Home';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {Example} from "./pages/Chat";
import UserProfile from './pages/UserProfile';
import * as settingsAction from "./redux/actions/settingsAction";
import { PersistGate } from 'redux-persist/integration/react';


const Stack = createStackNavigator();

//registNotification();
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} >
          <PaperProvider theme={ThemeOptions}>
            <Notify />
            <SafeAreaProvider>
              <GestureHandlerRootView>
                <NavigationContainer>
                  <Stack.Navigator initialRouteName="Home" screenListeners={({route,navigation}) => ({
                      state: (e) => {
                        // Do something with the state
                        // console.log("回到页面：",route.name,',state changed', e.data);
                        // Do something with the `navigation` object
                        //https://reactnavigation.org/docs/navigation-events#screenlisteners-prop-on-the-navigator
                        if(!navigation.canGoBack()) {
                          //console.log("we're on the initial screen");
                          store.dispatch(settingsAction.setHideHomeFAB(false))
                        }
                      },
                  })}>
                    <Stack.Screen name="Home" component={Home}  options={{headerShown: false,title:"首页"}}/>
                    <Stack.Screen name="Chat" component={Example}  options={{headerShown: true,title:"智能助手"}}/>
                    <Stack.Screen name="UserProfile" component={UserProfile}  options={{headerShown: true,title:"配置中心"}}/>
                  </Stack.Navigator>
                </NavigationContainer>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}