import randomString from 'random-string';
import * as notificationActions from './notificationActions';
import { Dispatch } from 'redux';

// This returns a redux-thunk action (a function).
export const notify = ({ type = 'info', text="知道了", timeout=2000 }) =>
{
	if (!timeout)
	{
		switch (type)
		{
			case 'info':
				timeout = 2000;
				break;
			case 'error':
				timeout = 5000;
				break;
			default:
				timeout = 2000;
				break;
		}
	}

	const notification =
	{
		id      : randomString({ length: 6 }).toLowerCase(),
		type    : type,
		text    : text,
		timeout : timeout
	};

	return (dispatch:Dispatch) =>
	{
		dispatch(notificationActions.addNotification(notification));

		setTimeout(() =>
		{
			dispatch(notificationActions.removeNotification(notification));
		}, timeout);
	};
};
