import { Astal, App, Gdk, Gtk } from 'astal/gtk4';
import { bind, execAsync, timeout } from 'astal';
import { isVisible } from './variables';


export const PowerOptions = () => {
    // Criar uma variável para controlar o estado do revealer

    return (
        <revealer
            revealChild={bind(isVisible)}
            transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        >
            <box
                name="poweroptions"
                vertical
                hexpand
                cssClasses={['powerOptions']}
            >
                <box marginBottom={15} >
                    <image iconName="system-shutdown-symbolic" cssClasses={['powerButton']} />
                    <label cssClasses={['powerMenuTitle']}>Power menu</label>
                </box>
                <button 
                    cursor={Gdk.Cursor.new_from_name('pointer', null)} 
                    onButtonPressed={() => execAsync('firefox')}
                >
                    <label halign={Gtk.Align.START}>Power off</label>
                </button>
                <button 
                    cursor={Gdk.Cursor.new_from_name('pointer', null)} 
                    onButtonPressed={() => execAsync('firefox')}
                >
                    <label halign={Gtk.Align.START}>Reboot</label>
                </button>
                <button 
                    cursor={Gdk.Cursor.new_from_name('pointer', null)} 
                    onButtonPressed={() => execAsync('firefox')}
                >
                    <label halign={Gtk.Align.START}>Sleep</label>
                </button>
            </box>
        </revealer>
    )
}
