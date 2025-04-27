import { GLib } from "astal";
import { Gtk, Gdk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Pango from "gi://Pango";

const { START, CENTER, END } = Gtk.Align;

const formatTime = (timestamp: number) =>
  GLib.DateTime.new_from_unix_local(timestamp).format("%H:%M")!;

export const notificationItem = (
  n: Notifd.Notification,
  onDelete?: (id: number) => void
) => (
  <box vertical cssClasses={["notification"]}>
    {/* Cabeçalho com ícone, nome do app e hora */}
    <box cssClasses={["header"]}>
      {(n.appIcon || n.desktopEntry) && (
        <image
          cssClasses={["app-icon"]}
          iconName={n.appIcon || n.desktopEntry}
        />
      )}

      <label
        cssClasses={["app-name"]}
        halign={START}
        ellipsize={Pango.EllipsizeMode.END}
        label={n.appName || "Unknown"}
      />

      <label
        cssClasses={["time"]}
        hexpand
        halign={END}
        label={formatTime(n.time)}
      />
      <button
        cssClasses={["close-button"]}
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
        onClicked={() => {
          if (onDelete) {
            onDelete(n.id);
          }
          n.dismiss();
        }}
      >
        <image iconName="window-close-symbolic" />
      </button>
    </box>

    {/* Conteúdo principal da notificação */}
    <box cssClasses={["content"]}>
      <box vertical>
        <label
          cssClasses={["summary"]}
          halign={START}
          wrap
          xalign={0}
          label={n.summary}
          maxWidthChars={1}
        />

        {n.image && n.get_hint("internal") && (
          <image
            file={n.image}
            heightRequest={100}
            widthRequest={100}
            cssClasses={["image"]}
          />
        )}

        {n.body && (
          <label
            cssClasses={["body"]}
            wrap
            xalign={0}
            label={n.body}
            maxWidthChars={1}
          />
        )}


      </box>
    </box>
  </box>
);
