import { Variable, bind } from "astal";
import Notifd from "gi://AstalNotifd";
import { notificationItem } from "./notificationitem";
import { Gtk } from "astal/gtk4";

const notificationsMap = new Map<number, Notifd.Notification>();
const notificationList = new Variable<Array<Notifd.Notification>>([]);

const updateList = () => {
  notificationList.set([...notificationsMap.values()].reverse());
};

const deleteNotification = (id: number) => {
  notificationsMap.delete(id);
  updateList();
};

const clearAllNotifications = () => {
  notificationsMap.clear();
  updateList();
  // Dismiss all notifications in Notifd
  const notifd = Notifd.get_default();
  notificationList.get().forEach((n) => n.dismiss());
};

export const NotificationMenu = () => (
  <box
    heightRequest={100}
    widthRequest={400}
    vertical
    cssClasses={["notificationMenu"]}
  >
    {/* Header com botão de limpar tudo */}

    <box visible={bind(notificationList).as((list) => list.length > 0)}>
      <Gtk.ScrolledWindow
        hexpand
        vexpand
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        //heightRequest={10}
      >
        <box
          vertical
          // spacing={8}
          cssClasses={["notification-list"]}
          vexpand={true}
          setup={(self) => {
            const notifd = Notifd.get_default();

            notifd.connect("notified", (_, id) => {
              notificationsMap.set(id, notifd.get_notification(id)!);
              updateList();
            });

            notifd.connect("resolved", (_, id) => {
              notificationsMap.delete(id);
              updateList();
            });
          }}
        >
          {bind(notificationList).as((list) =>
            list.map((n) => notificationItem(n, deleteNotification))
          )}
        </box>
      </Gtk.ScrolledWindow>
    </box>
    <box
      vertical
      //spacing={8}
      vexpand={true}
      cssClasses={["emptyList"]}
      visible={bind(notificationList).as((list) => list.length === 0)}
    >
      {/* Dialog com um sino */}
      <image iconName="notifications-disabled-symbolic" cssClasses={['alfred']} />
      <label label="Nenhuma notificação" />
    </box>
    <box cssClasses={["notification-header"]} hexpand>
      <label halign={Gtk.Align.START} hexpand>
        Notificações
      </label>
      <button
        halign={Gtk.Align.END}
        hexpand
        cssClasses={["clear-all"]}
        //visible={bind(notificationList).as((list) => list.length > 0)}
        onClicked={clearAllNotifications}
        sensitive={bind(notificationList).as((list) => list.length > 0)}
      >
        <label label="Clear All" />
      </button>
    </box>
  </box>
);
