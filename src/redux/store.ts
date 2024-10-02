import {rootReducer,RootReducer} from "./reducers/rootReducer";
import logger  from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig ={key: 'root',storage: AsyncStorage};

const reducer = persistReducer<RootReducer,any>(persistConfig,rootReducer);

// logger 用来输出日志 
const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
          serializableCheck: {
        		ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }})
				.concat(logger),
    devTools: true,
})
const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export { store,persistor }








