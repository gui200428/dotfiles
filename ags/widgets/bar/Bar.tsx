import { App, Astal, Gtk, Gdk } from "astal/gtk4"
import { Workspaces } from "./modules/workspaces"
import { CenterMenu } from "./modules/centermenu"
import { Status } from "./modules/statusmenu"
import { Picker } from "./modules/colorpicker"
import { LauncherMenu } from "./modules/launchermenu"
import { Mpris } from "./modules/mpris"
import { TrayComponent } from "./modules/tray"



function Start() {
    return (
        <box halign={Gtk.Align.START}>
            <LauncherMenu/>
            <Workspaces/>
        </box>
    )    
}

function Center() {
    return (
        <box halign={Gtk.Align.CENTER}>
            <CenterMenu/>
            <Mpris/>
        </box>
    )
}

function End() {
    return (
        <box halign={Gtk.Align.END}>
            <TrayComponent/>
            <Picker/>
            <Status/>
        </box>
    )
}

export const Bar = (monitor: number) =>

    <window
        visible
        name={"bar"}
        namespace={"bar"}
        cssClasses={["bar"]}
        monitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        application={App}>
            
        <centerbox cssClasses={["bar-container"]}>
            <Start />
            <Center />
            <End />
        </centerbox>
    </window>
