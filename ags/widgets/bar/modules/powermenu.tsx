import { App, Gdk } from 'astal/gtk4';
import { bind } from 'astal';
import Wp from 'gi://AstalWp';

const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  

const VolumeIcon = () => 
  <image iconName="system-shutdown-symbolic"/>

export const PowerMenu = () =>
  <button 
    onButtonPressed={() => {
      //App.get_window('calendar')?.hide();
      App.toggle_window('powermenu');
    }}
    cursor={Gdk.Cursor.new_from_name('pointer', null)}
    //onScroll={(_, __, y) => speaker.volume = (y < 0) ? speaker.volume + 0.05 : speaker.volume - 0.05 }
  >
    <box spacing={7} cssClasses={['statusMenu']}>
        <VolumeIcon/>
    </box>
  </button>
