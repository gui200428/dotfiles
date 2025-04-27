import { Gdk, Gtk } from 'astal/gtk4';
import { execAsync } from 'astal';

export const ActionButtons = () => {

    return (
    <box halign={Gtk.Align.CENTER} vertical>
        <box spacing={2} widthRequest={400}>
            <button
                cursor={Gdk.Cursor.new_from_name('pointer', null)}
                onClicked={() => execAsync('grimblast copy area')}
                widthRequest={200}
                cssClasses={['actionButtons']}
            >AAA</button>
            <button
                cursor={Gdk.Cursor.new_from_name('pointer', null)}
                onClicked={() => execAsync('grimblast copy area')}
                widthRequest={200}
                cssClasses={['actionButtons']}
            >BBB</button>
        </box>
        <box spacing={2} widthRequest={400}>
            <button
                cursor={Gdk.Cursor.new_from_name('pointer', null)}
                onClicked={() => execAsync('grimblast copy area')}
                widthRequest={200}
                cssClasses={['actionButtons']}
            >AAA</button>
            <button
                cursor={Gdk.Cursor.new_from_name('pointer', null)}
                onClicked={() => execAsync('grimblast copy area')}
                widthRequest={200}
                cssClasses={['actionButtons']}
            >BBB</button>
        </box>
    </box>
    )
}