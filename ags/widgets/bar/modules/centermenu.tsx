import { App, Gdk, Gtk } from 'astal/gtk4';
import { bind, Variable } from 'astal';
import { GLib } from 'astal';
import { toggleWindow } from '../../utils/windows';

const datetime = GLib.DateTime.new_now_local();
const date = datetime.format('%b %d')!.replace(/^\w/, c => c.toUpperCase());
const time = Variable<string>('').poll(1000,
  () => GLib.DateTime.new_now_local().format('%I:%M %p')! // %I -> hora 12h, %p -> AM/PM
);

export const CenterMenu = () =>
<button
    onButtonPressed={() => toggleWindow("centerMenu")}
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
