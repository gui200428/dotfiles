import { Gdk, Gtk, App } from 'astal/gtk4';
import { execAsync, bind} from 'astal';
import MprisService from 'gi://AstalMpris';

let mpris = MprisService.get_default();
const title = mpris.players[0].title;
const artist = mpris.players[0].artist;
const cover = mpris.players[0].artUrl;

App.apply_css(`
    .coverArt {
      background-image: url("${cover}");
    }
  `);


  export const MusicPlayer = () => {
    return (
<box halign={Gtk.Align.CENTER} spacing={2} widthRequest={400}>
      <box cssClasses={['coverArt']} widthRequest={200}/>
      <box widthRequest={180} vertical>
        <label 
          maxWidthChars={20}
          hexpand={true} 
          halign={Gtk.Align.START} 
          label={title}
          ellipsize={3}
          xalign={0}
          tooltipText={title}  // Mostra o texto completo no hover
        />
        <label 
          hexpand={true}
          halign={Gtk.Align.START}
          label={artist}
          ellipsize={3}
          xalign={0}
          tooltipText={artist}  // Mostra o texto completo no hover
        />
      </box>
    </box>
    );
  };