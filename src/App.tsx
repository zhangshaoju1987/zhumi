import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Notify from "./components/Notifications";
import { Notification, NotificationCompletion, Notifications, Registered, RegistrationError } from 'react-native-notifications';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store';
import ThemeOptions from "./Theme";
import Home from './pages/Home';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MapUsage from "./examples/MapUsage";
import {Example} from "./pages/Chat";
import UserProfile from './pages/UserProfile';
import * as settingsAction from "./redux/actions/settingsAction";
import { PersistGate } from 'redux-persist/integration/react';
import { NotificationActionResponse } from 'react-native-notifications/lib/dist/interfaces/NotificationActionResponse';


const Stack = createStackNavigator();

/**
 * 
 */
function registNotification(){
  Notifications.registerRemoteNotifications();
  Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log("Device Token Received", event.deviceToken);
  });
  Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
      console.error(event);
  });

  Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
    console.log("Notification Received - Foreground", notification.payload);
    // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
    completion({alert: true, sound: true, badge: false});
  });

  Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void, action: NotificationActionResponse) => {
    console.log("Notification opened by device user", notification.payload);
    console.log(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`);
    completion();
  });
      
  Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
    console.log("Notification Received - Background", notification.payload);

    // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
    completion({alert: true, sound: true, badge: false});
  });
}

Notifications.ios.checkPermissions().then((currentPermissions) => { 
  console.log('Badges enabled: ' + !!currentPermissions.badge);
  console.log('Sounds enabled: ' + !!currentPermissions.sound);
  console.log('Alerts enabled: ' + !!currentPermissions.alert);
  console.log('Car Play enabled: ' + !!currentPermissions.carPlay);
  console.log('Critical Alerts enabled: ' + !!currentPermissions.criticalAlert);
  console.log('Provisional enabled: ' + !!currentPermissions.provisional);
  console.log('Provides App Notification Settings enabled: ' + !!currentPermissions.providesAppNotificationSettings);
  console.log('Announcement enabled: ' + !!currentPermissions.announcement);
});

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
                        console.log("回到页面：",route.name,',state changed', e.data);
                        // Do something with the `navigation` object
                        //https://reactnavigation.org/docs/navigation-events#screenlisteners-prop-on-the-navigator
                        if(!navigation.canGoBack()) {
                          console.log("we're on the initial screen");
                          store.dispatch(settingsAction.setHideHomeFAB(false))
                        }
                      },
                  })}>
                    <Stack.Screen name="Home" component={Home}  options={{headerShown: false,title:"首页"}}/>
                    <Stack.Screen name="MapUsage" component={MapUsage}  options={{headerShown: true,title:"地图案例学习"}}/>
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