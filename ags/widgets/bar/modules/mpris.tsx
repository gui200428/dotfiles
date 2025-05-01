import { bind } from 'astal';
import { Gdk, Gtk } from 'astal/gtk4'; // Gtk pode ser necessário para o widget image
import MprisService from 'gi://AstalMpris';
import AstalMpris from 'gi://AstalMpris?version=0.1'; // Para usar AstalMpris.PlaybackStatus

const mpris = MprisService.get_default();

export const Mpris = () => {
    // Função helper para obter o primeiro player (ou null)
    const getFirstPlayer = (): AstalMpris.Player | null => {
        return mpris.players.length > 0 ? mpris.players[0] : null;
    };

    return (
        <button
            cssClasses={['mpris']} // Mantenha ou ajuste sua classe CSS
            // Ação de clique: Tenta pausar/retomar o primeiro player
            onButtonPressed={() => {
                const player = getFirstPlayer();
                player?.play_pause(); // Usa optional chaining (?.) para segurança
            }}
            // Ação de scroll: Tenta ir para próximo/anterior
            onScroll={(_, __, y) => {
                const player = getFirstPlayer();
                if (player) { // Verifica se o player existe
                    if (y > 0) {
                        player.next();
                    } else {
                        player.previous();
                    }
                }
            }}
            // Visibilidade: Vinculado à existência de players (correto)
            visible={bind(mpris, 'players').as((players) => (players.length > 0))}
            cursor={Gdk.Cursor.new_from_name('pointer', null)}
            tooltipText="Play/Pause Media (Scroll for Next/Previous)" // Adiciona tooltip
        >
            {/* Imagem com ícone dinâmico */}
            {/* Usamos um bind na lista de players para obter o player atual */}
            {bind(mpris, 'players').as(players => {
                // Se não houver player (embora o botão deva estar invisível), retorna um ícone padrão
                if (players.length === 0) {
                    return <image iconName="emblem-music-symbolic"/>;
                }
                const player = players[0];
                // Cria um SEGUNDO bind, desta vez para o playbackStatus DO player encontrado
                return <image iconName={bind(player, 'playbackStatus').as(status =>
                    status === AstalMpris.PlaybackStatus.PLAYING
                        ? 'media-playback-pause-symbolic' // Ícone de Pause
                        : 'media-playback-start-symbolic' // Ícone de Play (ou padrão)
                )} />;
            })}
        </button>
    );
}
