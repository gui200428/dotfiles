// widgets/quicksettings/quicksettings.tsx

// --- Importações ---
import { VolumeSlider } from './sound';
import { App, Astal, Gdk, Gtk } from 'astal/gtk4';
import { execAsync, bind } from 'astal';
// import { DND } from '../notifications/notifications'; // Importe se usar DNDToggle
import { PowerOptions } from './poweroptions';
import { MusicPlayer } from './modules/musicplayer';
import { ScrimWindow } from '../common/ScrimWindow';
import { hideAllWindows, toggleWindow } from '../utils/windows'; // Ajuste o caminho
// --- Componentes Internos (Restaurando Ações) ---
import { powerOptionsVisible } from './variables'; // Ajuste o caminho

const ScreenshotButton = () => // Nome correto
    <button
        tooltipText="Screenshot Area (Copy)"
        cursor={Gdk.Cursor.new_from_name('pointer', null)}
        // --- AÇÃO RESTAURADA ---
        onButtonPressed={() => {
            console.log("Screenshot button pressed!"); // Log para confirmar
            execAsync('grimblast copy area')
                .catch(err => console.error("Screenshot command failed:", err));
        }}
        // --- FIM DA RESTAURAÇÃO ---
        cssClasses={['menuButtons']}
    >
        <image iconName="camera-photo-symbolic"/>
    </button>

// Botão PowerMenu: Precisa de uma *nova* função.
// A função antiga (toggle isVisible) não se aplica mais.
// O que este botão DEVE fazer? Abrir outro menu? Chamar uma ação?
const PowerMenuButton = () => (
    <button
        tooltipText="Toggle Power Options" // Tooltip mais claro
        cursor={Gdk.Cursor.new_from_name('pointer', null)}
        // --- AÇÃO: Alterna a variável powerOptionsVisible ---
        onClicked={() => {
            console.log("Toggling Power Options visibility");
            powerOptionsVisible.set(!powerOptionsVisible.get());
        }}
        // Adiciona classe 'active' se o power menu estiver visível (opcional)
        cssClasses={bind(powerOptionsVisible).as(v => ['menuButtons', ...(v ? ['active'] : [])])}
     >
        <image iconName="system-shutdown-symbolic"/>
    </button>
);
/*
const DNDToggle = () => // Se usar, a ação original estava correta
    <button
        tooltipText="Do Not Disturb"
        onButtonPressed={() => DND.set(!DND.get())} // Ação original
        cssClasses={bind(DND).as(dnd => ['dnd', dnd ? 'active' : ''])}
        cursor={Gdk.Cursor.new_from_name('pointer', null)}
    >
        <image iconName="notifications-disabled-symbolic"/>
    </button>
*/


// --- Componente Principal QuickSettings ---
export const QuickSettings = () => {

    // Define o conteúdo real do QuickSettings
    const quickSettingsContent = (
        <box
            widthRequest={400}
            cssClasses={['quickSettings']}
            vertical
        >
            {/* Linha Superior de Botões */}
            <box spacing={5} marginBottom={10} halign={Gtk.Align.END}>
                {/* <DNDToggle /> */}
                <ScreenshotButton /> {/* Botão com ação restaurada */}
                <PowerMenuButton /> {/* Botão visual, ação precisa ser definida */}
            </box>

            {/* Módulos Principais */}
            <PowerOptions />
            <box marginBottom={5}><VolumeSlider /></box>
            <box><MusicPlayer /></box>
        </box>
    );

    // Usa o componente ScrimWindow (sem alterações aqui)
    return (
        <ScrimWindow
            name="quickSettings"
            anchor={
                Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT
            }
            layer={Astal.Layer.TOP}
            child_halign={Gtk.Align.END}
            child_valign={Gtk.Align.START}
            child_marginTop={10}
            child_marginEnd={10}
            child={quickSettingsContent}
        />
    );
};
