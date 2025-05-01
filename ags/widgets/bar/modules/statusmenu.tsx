import { App, Gdk, Gtk } from 'astal/gtk4';
import { bind } from 'astal';
import Wp from 'gi://AstalWp';
import { toggleWindow } from '../../utils/windows';

const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  

const VolumeIcon = () => 
  <image iconName={bind(speaker, 'volumeIcon')}/>
  
const PowerIcon = () =>
  <image iconName="system-shutdown-symbolic"/>

export const Status = () =>
  <button
    onButtonPressed={() => toggleWindow("quickSettings")}
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
