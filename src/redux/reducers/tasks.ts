import { PayloadAction } from "@reduxjs/toolkit";
import { LatLng } from "react-native-maps";

export interface TaskInfo{
    uuid:string,
    type:string,
    center:LatLng,
    radius:number
}

const tasks = (state = [], action:PayloadAction<TaskInfo>) =>
{
	switch (action.type)
	{
		case 'ADD_TASK':
		{
			const taskInfo  = action.payload;

            return [ ...state, taskInfo ];
		}
		case 'DELETE_TASK':
        {
            const {uuid}  = action.payload;

            return state.filter((taskInfo:TaskInfo) => taskInfo.uuid !== uuid);
        }
		default:
			return state;
	}
};

export default tasks;