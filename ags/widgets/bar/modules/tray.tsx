import { Gdk }  from 'astal/gtk4';
import { bind, } from "astal"
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

export const TrayComponent = () => 
    <box cssClasses={["systray"]} spacing={4}>
{bind(tray, "items").as(items => items.map(item => (
    <menubutton
        setup={self => {
            self.insert_action_group("dbusmenu", item.actionGroup)
        }}
        tooltipMarkup={bind(item, "tooltipMarkup")}
        popover={undefined}
        //actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={bind(item, "menuModel")}
        >
        <image gicon={bind(item, "gicon")} />
    </menubutton>
)))}
</box>