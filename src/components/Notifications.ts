import { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'react-native-snackbar';
import * as notificationActions from "../redux/actions/notificationActions";


class Notifications extends Component
{
	displayed:string[] = [];

	lastShowTime = -1;
	storeDisplayed = (id:string) =>
	{
		this.displayed = [ ...this.displayed, id ];
	};

	shouldComponentUpdate({ notifications: newNotifications = [] })
	{
		const { notifications: currentNotifications } = this.props as any;

		let notExists = false;

		for (let i = 0; i < newNotifications.length; i += 1)
		{
			if (notExists) continue;

			notExists = notExists ||
				!currentNotifications.filter(({ id }:{id:string}) => (newNotifications[i] as any).id === id).length;
		}

		return notExists;
	}

	componentDidUpdate()
	{
		const { notifications = [] } = this.props as any;
		
		notifications.forEach((notification:NotificationType) =>
		{
			// 忽略已经展示的
			if (this.displayed.includes(notification.id)) return;
			
			// 展示
			//console.log("展示消息：",notification.id);
			const theme = {backgroundColor:"#1A1915"};
			if(notification.type === 'error'){
				theme.backgroundColor = '#F8BC31'
			}

			// 确保是字符串(保护性措施)
			let text = notification.text;
			if( text && typeof text === "object"){
				console.error("检测到非法对象类型数据（说明调用存在问题）："+text);
				text = JSON.stringify(text);
				
			}
			// 最多只显示64个字符，防止字符太多导致UI异常展示(保护性措施)
			let maxLen = 64;
			if(text && text.length > maxLen){
				text = text.substring(0,maxLen);
			}

            Snackbar.show({
                text,
                duration: notification.timeout,
                textColor: notification.textColor || '#fff',
                backgroundColor: notification.backgroundColor || theme.backgroundColor || '#1A1915',
                numberOfLines:5,
                action: {
                    text: '知道了',
                    textColor: '#fff',
                    onPress: () => { /* Do something. */ },
                    },
            });
			
			// 保存到已展示
			this.storeDisplayed(notification.id);
			// 从store移除
			(this.props as any).removeNotification(notification.id);
		});
	}

	render()
	{
		return null;
	}
}

const mapStateToProps = (state:any) =>
	({
		notifications : state.notifications
	});

const mapDispatchToProps = (dispatch:any) =>
	({
		removeNotification : (notificationId:string) =>
			dispatch(notificationActions.removeNotification( notificationId ))
	});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.notifications === next.notifications
			);
		}
	}
)(Notifications);