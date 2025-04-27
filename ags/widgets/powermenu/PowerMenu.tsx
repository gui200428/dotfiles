import { Astal, App, Gdk } from 'astal/gtk4';
import { execAsync } from 'astal';

const SleepIcon = () =>
   <image iconName="weather-clear-night-symbolic" cssClasses={['sleep']} />

const PowerIcon = () =>
   <image iconName="system-shutdown-symbolic" cssClasses={['power']} />

const RebootIcon = () =>
   <image iconName="system-reboot-symbolic" cssClasses={['reboot']} />

export const PowerMenu = () =>
   <window
      name="powermenu"
      application={App}
      visible={false}
      keymode={Astal.Keymode.ON_DEMAND} 
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM }

      onKeyPressed={(self, key) => {
         self.hide();
         switch (key) {
            case 113: // Q
               execAsync('systemctl poweroff')
               break;
            case 114: // R
               execAsync('systemctl reboot');
               break;
            case 115: // S
               execAsync('systemctl suspend');
               break;
         };
      }}
   >
      <box>
         <button cursor={Gdk.Cursor.new_from_name('pointer', null)} onButtonPressed={() => execAsync('systemctl suspend')}>
            <SleepIcon/>
         </button>
         <button cursor={Gdk.Cursor.new_from_name('pointer', null)} onButtonPressed={() => execAsync('systemctl poweroff')}>
            <PowerIcon/>
         </button>
         <button cursor={Gdk.Cursor.new_from_name('pointer', null)} onButtonPressed={() => execAsync('systemctl reboot')}>
            <RebootIcon/>
         </button>
      </box>
   </window>
