import { Gdk, Gtk } from "astal/gtk4";
import { execAsync } from "astal";
import { GLib } from "astal";
import { Variable } from "astal";

const datetime = GLib.DateTime.new_now_local();
//const date = datetime.format('%b %d')!.replace(/^\w/, c => c.toUpperCase());
// dia mes ano
const date = datetime.format('%d %B %Y')!;
const day = datetime.format('%A')!;
const time = Variable<string>('').poll(1000,
  () => GLib.DateTime.new_now_local().format('%I:%M %p')! // %I -> hora 12h, %p -> AM/PM
);


export const Calendar = () => {
  return (
    <box halign={Gtk.Align.CENTER} vertical cssClasses={['calendarMenu']} hexpand={true} vexpand={true}> 
        <box vertical halign={Gtk.Align.START} cssClasses={['calendarPanel']}>
            <label halign={Gtk.Align.START} cssClasses={['calendarDay']}>{day}</label>
            <label halign={Gtk.Align.START} cssClasses={['calendarDate']}>{date}</label>
        </box>
        <box cssClasses={['calendar']}>
            <Gtk.Calendar/>
        </box>
    </box>
  );
};
