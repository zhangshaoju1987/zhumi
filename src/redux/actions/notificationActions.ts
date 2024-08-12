export const addNotification = (notification:NotificationType) =>
	({
		type    : 'ADD_NOTIFICATION',
		payload : notification
	});

export const removeNotification = (id:NotificationType) =>
	({
		type    : 'REMOVE_NOTIFICATION',
		payload : { id }
	});

export const removeAllNotifications = () =>
	({
		type : 'REMOVE_ALL_NOTIFICATIONS'
	});