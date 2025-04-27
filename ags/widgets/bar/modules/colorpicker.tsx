import { App, Gdk } from 'astal/gtk4';
import { execAsync } from 'astal';
import { bind } from 'astal';
import Bluetooth from 'gi://AstalBluetooth';
import Wp from 'gi://AstalWp';

const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  

const PickerIcon = () => 
  <image iconName="color-select-symbolic"/>

export const Picker = () =>
  <button 
    onButtonPressed={() => execAsync('hyprpicker -a')}
    cursor={Gdk.Cursor.new_from_name('pointer', null)}
  >
    <box spacing={7} cssClasses={['statusMenu']}>
        <PickerIcon/>
    </box>
  </button>
