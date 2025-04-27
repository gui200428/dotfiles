import { App, Gtk } from 'astal/gtk4';
import { GLib, exec } from 'astal';
import style from "./style/style.scss"
import { Bar } from "./widgets/bar/Bar"
import { topLeft, topRight } from './widgets/corners';
import { calendar } from './widgets/calendar';
import { QuickSettings } from './widgets/quicksettings/quicksettings';
import { CenterMenu } from './widgets/centermenu/centermenu';
import { launcher } from './widgets/launcher/launcher';
//import { PowerMenu } from './widgets/powermenuOLD/PowerMenu';
import { notifications, clearOldestNotification } from './widgets/notifications/notifications';
import Hyprland from 'gi://AstalHyprland?version=0.1';

// Styles
import quicksettingsStyle from './widgets/quicksettings/quicksettings.css';
import centermenuStyle from './widgets/centermenu/centermenu.css';
import launcherStyle from './widgets/launcher/launcher.css';
//import powermenuStyle from './widgets/powermenu/PowerMenu.css';
import notificationStyle from './widgets/notifications/notifications.css';

// Temp
GLib.setenv("LD_PRELOAD", "", true)


const hypr = Hyprland.get_default();

const widgetMap: Map<number, Gtk.Widget[]> = new Map();


const widgets = (monitor: number) => [
    Bar(monitor),
    topLeft(monitor),
    topRight(monitor),
    //bottomLeft(monitor),
    //bottomRight(monitor)
]

App.start({
    css: style + centermenuStyle + quicksettingsStyle + launcherStyle + notificationStyle,
    main() {
        hypr.get_monitors().map((monitor) => widgetMap.set(monitor.id, widgets(monitor.id)));
        //notifications();
        calendar();
        CenterMenu();
        QuickSettings();
        launcher();
        //PowerMenu();
    },
    requestHandler(req, res) {
        const reqArgs = req.split(" ");
        switch (reqArgs[0]) {
            case "launcher":
                App.toggle_window('launcher');
                break;
        };
        //res("OK");
    }
})
