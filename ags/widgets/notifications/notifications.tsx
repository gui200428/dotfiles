import { App, Astal } from 'astal/gtk4';
import Notifd from 'gi://AstalNotifd';
import { notificationItem } from './notificationitem';
import { Variable, bind } from 'astal';
const { TOP, RIGHT } = Astal.WindowAnchor;
export const DND = Variable(false);

const map: Map<number, Notifd.Notification> = new Map();
const notificationlist: Variable<Array<Notifd.Notification>> = new Variable([]);

const notifiy = (ignoreDND = false) =>
	(!DND.get() || ignoreDND) &&
		notificationlist.set([...map.values()].reverse());

const setKey = (key: number, value: Notifd.Notification) => {
	map.set(key, value);
	notifiy();
};

const deleteKey = (key: number) => {
	map.delete(key);
	notifiy(true); // Force-delete notification even if DND is enabled
};
	
export const notifications = () =>
	<window
		name="notifications"
		anchor={TOP}
		application={App}
        monitor={0}
		visible={bind(notificationlist).as(n => (n.length != 0) ? true : false)}
		setup={() => {
			const notifd = Notifd.get_default();
			notifd.connect("notified", (_, id) =>
				setKey(id, notifd.get_notification(id)!)
			);
			notifd.connect("resolved", (_, id) =>
				deleteKey(id)
			);
		}}
	>
		<box vertical>
			{bind(notificationlist).as((n) => n.map(notificationItem))}
        </box>
	</window>

export const clearOldestNotification = () =>
	deleteKey([...map][0][0]);
