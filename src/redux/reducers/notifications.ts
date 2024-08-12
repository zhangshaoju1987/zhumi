import { PayloadAction } from "@reduxjs/toolkit";

const notifications = (state = [], action:PayloadAction<NotificationType>) =>
{
    switch (action.type)
    {
        case 'ADD_NOTIFICATION':
        {
            const notification  = action.payload;

            return [ ...state, notification ];
        }

        case 'REMOVE_NOTIFICATION':
        {
            const {id}  = action.payload;

            return state.filter((notification:NotificationType) => notification.id !== id);
        }

        case 'REMOVE_ALL_NOTIFICATIONS':
        {
            return [];
        }

        default:
            return state;
    }
};
    
export default notifications;
    