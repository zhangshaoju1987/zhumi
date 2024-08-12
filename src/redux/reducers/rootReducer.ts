import { combineReducers } from 'redux';
import notifications from "./notifications"
import settings from './settings';




export const rootReducer = combineReducers({ 
    notifications,
    settings
});
export type RootReducer = ReturnType<typeof rootReducer>;
