import { TaskInfo } from "../reducers/tasks";

export const addTask = (taskInfo:TaskInfo) =>
    ({
        type: 'ADD_TASK',
        payload: taskInfo
    });

export const deleteTask = (uuid:string) =>
    ({
        type: 'DELETE_TASK',
        payload: {uuid}
    });