//import { BrightnessSlider } from '../../services/brightness';
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { Calendar } from "./modules/calendar";
import { NotificationMenu } from "./modules/notificationMenu";

const hide = () => {
  const win = App.get_window("centerMenu")!;
  if (!win.visible) {
    win.show();
    win.get_style_context().remove_class("fade-out");
    (win.child as Gtk.Revealer).revealChild = true;
  } else {
    (win.child as Gtk.Revealer).revealChild = false;
    win.get_style_context().add_class("fade-out");
    setTimeout(() => {
      win.hide();
      win.get_style_context().remove_class("fade-out");
    }, 300);
  }
};

export const CenterMenu = () => {
  return (
    <window
      name="centerMenu"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
      application={App}
      visible={false}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(_, key) => {
        if (key == 65307) {
          hide();
        }
      }}
    >
      <revealer transitionType={Gtk.RevealerTransitionType.SLIDE_UP}>
        <box
          vertical
          vexpand={true}
          valign={Gtk.Align.START}
          halign={Gtk.Align.CENTER}
        >
          <box
            widthRequest={400}
            cssClasses={["centerMenu"]}
            vertical
            vexpand={true}
            valign={Gtk.Align.START}
            halign={Gtk.Align.CENTER}
          >
            {/* Uma box com duas box dentro - horizontal */}
            <box hexpand>
              <NotificationMenu />
              <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
              <box hexpand>
                <Calendar />
              </box>
            </box>
          </box>
        </box>
      </revealer>
    </window>
  );
};
