import { bind } from 'astal';
import { Gdk } from 'astal/gtk4';
import MprisService from 'gi://AstalMpris';

const mpris = MprisService.get_default();

export const Mpris = () => 
    <button
        cssClasses={['mpris']}
        onButtonPressed={() => mpris.players[0].play_pause()}
        onScroll={(_, __, y) => (y > 0) ? mpris.players[0].next() : mpris.players[0].previous()}
        visible={bind(mpris, 'players').as((players) => (players.length > 0))}
        cursor={Gdk.Cursor.new_from_name('pointer', null)}
    >
        <image iconName="emblem-music-symbolic"/>
    </button>
