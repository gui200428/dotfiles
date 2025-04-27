import { Gdk, Gtk, App, Astal } from 'astal/gtk4';
import { execAsync, bind, GLib} from 'astal';
import MprisService from 'gi://AstalMpris';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { Button } from 'astal/gtk4/widget';

type PlayerProps = {
  player: AstalMpris.Player;
}

const formatTime = (microseconds: number) => {
  const minutes = Math.floor(microseconds / 60);
  const seconds = microseconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};


const Player = ({ player }: PlayerProps) => {
  // Criamos uma referência para o label que será atualizado
  const titleRef = new Gtk.Label({
    cssClasses: ['playerTitle'],
    label: player.title,
    max_width_chars: 25, 
    width_chars: 20,
    hexpand: true,
    halign: Gtk.Align.START,
    xalign: 0,
    ellipsize: 3
  });

  const artistRef = new Gtk.Label({
    cssClasses: ['playerArtist'],
    label: player.get_artist() || 'Unknown Artist',
    max_width_chars: 20,
    width_chars: 20, 
    hexpand: true,
    halign: Gtk.Align.START,
    xalign: 0,
    ellipsize: 3
  });

  // Labels para mostrar o tempo
  const currentTimeRef = new Gtk.Label({
    label: formatTime(player.position),
    width_chars: 5,
    halign: Gtk.Align.START,
    xalign: 0,
  });

  const totalTimeRef = new Gtk.Label({
    label: formatTime(player.length),
    width_chars: 5,
    halign: Gtk.Align.END,
    xalign: 0,
  });

  const coverRef = Gtk.Label.new(`background-image: url("${player.artUrl}");`);
  let sliderRef: Gtk.Scale | null = null;
  
  // Conectamos ao sinal de mudança de metadados do player
  player.connect('notify::metadata', () => {
    // Atualiza o texto do label quando os metadados mudarem
    titleRef.set_text(player.title);
    artistRef.set_text(player.get_artist() || 'Unknown Artist');
    coverRef.set_text(`background-image: url("${player.artUrl}");`);
    totalTimeRef.set_text(formatTime(player.length));
    App.apply_css(`
      .coverArt {
        ${coverRef.get_text()}
      }
    `);
  });

  // Conectamos ao sinal de mudança de estado do player
  player.connect('notify::playback-status', () => {
    // A atualização do estado acontecerá automaticamente através do bind
  });

  // Helper para verificar o estado de reprodução
  const isPlaying = () => player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING;

  // Setup do timer quando o widget é criado
  const setupWidget = (widget: Gtk.Scale) => {
    sliderRef = widget;
    
    // Inicia o timer para atualizar a posição
    const timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
      if (sliderRef && isPlaying()) {
        const position = player.length > 0 ? player.position / player.length : 0;
        sliderRef.set_value(position);
        // Atualiza o tempo atual
        currentTimeRef.set_text(formatTime(player.position));
      }
      return true;
    });

    // Limpa o timer quando o widget for destruído
    widget.connect('destroy', () => {
      if (timerId) {
        GLib.source_remove(timerId);
      }
    });
  };

  return (
    <box cssClasses={['player']} hexpand>
      <box cssClasses={['coverArt']} widthRequest={150}/>
      <box vertical widthRequest={250} halign={Gtk.Align.START} cssClasses={['playerInfo']}>
        <box widthRequest={100} vertical>
          {titleRef}
          {artistRef}
        </box>
        <box hexpand vertical cssClasses={['playerControls']}>
          <box cssClasses={['playerSlider']}>
            <slider
              hexpand
              setup={setupWidget}
              onChangeValue={({ value }) => {
                player.position = player.length * value;
                currentTimeRef.set_text(formatTime(player.position));
              }}
              value={player.length > 0 ? player.position / player.length : 0}
            />
          </box>
          <box hexpand>
            <box halign={Gtk.Align.START}>
              {currentTimeRef}
            </box>
            <box halign={Gtk.Align.CENTER} hexpand>
              <button onButtonPressed={() => player.previous()}>
                <image iconName="media-skip-backward-symbolic"/>
              </button>
              <button onButtonPressed={() => player.play_pause() }>    
                {/*Atualizar o botão em tempo real*/}          
                <image iconName={bind(player, 'playbackStatus').as(status => status === AstalMpris.PlaybackStatus.PLAYING ? 'media-playback-pause-symbolic' : 'media-playback-start-symbolic')}/>
              </button>
              <button onButtonPressed={() => player.next()}>
                <image iconName="media-skip-forward-symbolic"/>
              </button>
            </box>
            <box halign={Gtk.Align.END}>
              {totalTimeRef}
            </box>
          </box>
        </box>
      </box>
    </box>
  );
}

export const MusicPlayer = () => {
  const mpris = AstalMpris.get_default();

  return (
    <box halign={Gtk.Align.CENTER} spacing={2} widthRequest={400}>
      {bind(mpris, "players").as(arr => 
        // Verifica se há players antes de renderizar
        arr && arr.length > 0 
          ? arr.map(player => <Player player={player} />)
          : <></>
      )}
    </box>
  );
}