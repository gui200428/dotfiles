import { App, Gdk, Gtk } from 'astal/gtk4';
import { bind, Variable } from 'astal';
import { GLib } from 'astal';

const datetime = GLib.DateTime.new_now_local();
const date = datetime.format('%b %d')!.replace(/^\w/, c => c.toUpperCase());
const time = Variable<string>('').poll(1000,
  () => GLib.DateTime.new_now_local().format('%I:%M %p')! // %I -> hora 12h, %p -> AM/PM
);

export const CenterMenu = () =>
  <button
onButtonPressed={() => {
    const win = App.get_window('centerMenu')!;
    if (!win.visible) {
        win.show();
        win.get_style_context().remove_class('fade-out');
        (win.child as Gtk.Revealer).revealChild = true;
    } else {
        (win.child as Gtk.Revealer).revealChild = false;
        win.get_style_context().add_class('fade-out');
        setTimeout(() => {
            win.hide();
            win.get_style_context().remove_class('fade-out');
        }, 300);
    }
    }}
    cursor={Gdk.Cursor.new_from_name('pointer', null)}
  >
    <box 
      spacing={7} 
      cssClasses={['statusMenu']}
      hexpand={true}
      vexpand={false}
      homogeneous={false}
    >
        <label>{date}</label>
        <label>{time()}</label>
      </box>
  </button>
