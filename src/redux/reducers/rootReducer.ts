import { combineReducers } from 'redux';
import notifications from "./notifications"
import settings from './settings';
import tasks from './tasks';




export const rootReducer = combineReducers({ 
    notifications,
    settings,
    tasks,
});
export type RootReducer = ReturnType<typeof rootReducer>;
