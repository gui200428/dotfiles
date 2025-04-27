//import { BrightnessSlider } from '../../services/brightness';
import { VolumeSlider, SinkSelector } from './sound';
import { App, Astal, Gdk, Gtk } from 'astal/gtk4';
import { bind, execAsync } from 'astal';
import { DND } from '../notifications/notifications';
import { PowerOptions } from './poweroptions';
import { ActionButtons } from './modules/actionbuttons';
import { MusicPlayer } from './modules/musicplayer';
import { isVisible } from './variables';


const DNDToggle = () => 
    <button
        widthRequest={60}
        onButtonPressed={() => DND.set(!DND.get())}
        cssClasses={bind(DND).as((dnd) => (dnd) ? ['dnd', 'active'] : ['dnd'])}
        cursor={Gdk.Cursor.new_from_name('pointer', null)}
    >
        <image iconName="notifications-disabled-symbolic"/>
    </button>

const PowerMenu = () =>
    <button 
    cursor={Gdk.Cursor.new_from_name('pointer', null)}
    onClicked={() => isVisible.set(!isVisible.get())}
    cssClasses={['menuButtons']}
    >
        <image iconName="system-shutdown-symbolic"/>
    </button>

const Screnshot = () =>
    <button
        cursor={Gdk.Cursor.new_from_name('pointer', null)}
        onButtonPressed={() => execAsync('grimblast copy area')}
        cssClasses={['menuButtons']}
    >
        <image iconName="camera-photo-symbolic"/>
    </button>

const hide = () => {
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
}

export const QuickSettings = () => {
    
    return (
    <window
        name="quickSettings"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        application={App}
        visible={false}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        keymode={Astal.Keymode.ON_DEMAND} 

        onKeyPressed={(_, key) => {
            if (key == 65307) {
                hide();
            }
        }}
    >

        <revealer transitionType={Gtk.RevealerTransitionType.SLIDE_UP}>
            <box>
                <button
                onClicked={hide}
                heightRequest={5000}
                widthRequest={5000}
                hexpand
                vexpand
                cssClasses={['invisibleButton']}
                halign={Gtk.Align.FILL}
                valign={Gtk.Align.START}
                />
                <box vertical vexpand={true} valign={Gtk.Align.START} halign={Gtk.Align.CENTER}>
                    <box widthRequest={400} cssClasses={['quickSettings']} vertical vexpand={true} valign={Gtk.Align.START} halign={Gtk.Align.CENTER}>
                        <box marginBottom={5}>
                            <box vertical>
                                <box spacing={2} halign={Gtk.Align.END}>
                                    <Screnshot/>
                                    <PowerMenu/>
                                    <button onClicked={hide} />
                                </box>
                                <box>
                                    <PowerOptions/>
                                </box>
                                <box>
                                    <VolumeSlider/>
                                </box>
                                <box>
                                    <MusicPlayer/>
                                </box>

                            </box>
                        </box>
                    </box>
                    <box>
                        <button
                            onClicked={hide}
                            heightRequest={1500}
                            vexpand
                            hexpand
                            cssClasses={['invisibleButton']}
                            valign={Gtk.Align.START}
                            halign={Gtk.Align.FILL}
                        />
                    </box>
                </box>
            </box>
        </revealer>
    </window>
    )
}

