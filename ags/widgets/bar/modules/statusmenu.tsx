import { App, Gdk, Gtk } from 'astal/gtk4';
import { bind } from 'astal';
import Wp from 'gi://AstalWp';

const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  

const VolumeIcon = () => 
  <image iconName={bind(speaker, 'volumeIcon')}/>
  
const PowerIcon = () =>
  <image iconName="system-shutdown-symbolic"/>

export const Status = () =>
  <button
onButtonPressed={() => {
    const win = App.get_window('quickSettings')!;
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
    onScroll={(_, __, y) => speaker.volume = (y < 0) ? speaker.volume + 0.05 : speaker.volume - 0.05}
  >
    <box 
      spacing={7} 
      cssClasses={['statusMenu']}
      hexpand={true}
      vexpand={false}
      homogeneous={false}
    >
      <VolumeIcon/>
      <PowerIcon/>
    </box>
  </button>
