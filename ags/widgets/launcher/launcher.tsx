import Apps from 'gi://AstalApps'
import { App, Astal, Gtk, Gdk } from 'astal/gtk4';
import { bind } from 'astal';
//import { playlistName } from '../../services/mediaplayer';
import { ScrimWindow } from '../common/ScrimWindow';
import { hideAllWindows, toggleWindow } from '../utils/windows'; // Ajuste o caminho

const apps = new Apps.Apps()
//let textBox: Gtk.Entry | null = null;

const AppBtn = ({ app }: { app: Apps.Application }) => (
    <button
        onKeyPressed={(_, keyval) => {
            if (keyval === Gdk.KEY_Return) { app.launch(); hideAllWindows(); }
        }}
        onClicked={() => { app.launch(); hideAllWindows(); }}
    >
        {/* ... conteúdo do botão ... */}
        <box>
            <image iconName={app.iconName}/>
            <box valign={Gtk.Align.CENTER} vertical>
                <label cssClasses={['name']} xalign={0} label={app.name}/>
                {app.description && <label cssClasses={['description']} wrap maxWidthChars={1} xalign={0} label={app.description}/>}
            </box>
        </box>
    </button>
);

// --- Componente Principal Launcher ---
export const Launcher = () => {

    // Cria a instância do Gtk.Entry programaticamente
    const entryRef = new Gtk.Entry({
        primaryIconName: "system-search-symbolic",
        placeholderText: "Search",
        // Adiciona alguma classe para estilizar se necessário
        // cssClasses: ['launcher-entry'],
    });

    // Conecta o sinal 'activate' (Enter) diretamente no objeto Gtk.Entry
    entryRef.connect('activate', () => {
        const query = entryRef.text; // Acessa o texto diretamente
        const results = apps.fuzzy_query(query ?? "");
        if (results && results.length > 0) {
            results[0].launch();
            hideAllWindows();
        }
    });

    // Define o conteúdo principal do launcher
    const launcherContent = (
        <box heightRequest={700} widthRequest={500} cssClasses={['launcher']} vertical>
            <overlay>
                {/* <box cssClasses={['searchBg']} /> */}
                {/* Renderiza a instância Gtk.Entry criada */}
                {entryRef}
            </overlay>
            <Gtk.ScrolledWindow hexpand vexpand hscrollbarPolicy={Gtk.PolicyType.NEVER} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC} cssClasses={['launcher-results-scroll']}>
                <box spacing={6} vertical>
                    {/* Bind aos resultados da pesquisa (ainda usa entryRef) */}
                    {bind(entryRef, 'text').as(text =>
                        apps.fuzzy_query(text ?? "").slice(0, 5)
                        .map((app: Apps.Application) => <AppBtn key={app.app_id} app={app}/>)
                    )}
                </box>
            </Gtk.ScrolledWindow>
        </box>
    );

    // Usa o componente ScrimWindow
    return (
        <ScrimWindow
            name="launcher"
            anchor={ /* ... tela cheia ... */
                Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT
            }
            layer={Astal.Layer.OVERLAY}
            exclusivity={Astal.Exclusivity.IGNORE}
            child_halign={Gtk.Align.CENTER}
            child_valign={Gtk.Align.CENTER}
            child={launcherContent}
            // --- Passa a lógica de foco para setupWindow ---
            setupWindow={windowWidget => {
                 // Agora temos certeza que 'windowWidget' (a Gtk.Window) existe

                 // 1. Conecta ao sinal 'window-toggled' do App
                 // Usamos 'entryRef' que está no escopo do componente Launcher
                 App.connect("window-toggled", (_app, windowName, isVisible) => {
                    if (windowName === "launcher" && isVisible) {
                         console.log("[Launcher] Window toggled visible. Grabbing focus."); // Log
                         // Pequeno delay para garantir que a janela está pronta para receber foco
                         GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
                            if (entryRef && entryRef.get_realized() && entryRef.get_mapped()) { // Verifica se o entry está pronto
                                 entryRef.grab_focus();
                            } else {
                                // Tenta novamente um pouco depois se não estiver pronto
                                GLib.timeout_add(GLib.PRIORITY_DEFAULT, 50, () => {
                                    if (entryRef) entryRef.grab_focus();
                                    return GLib.SOURCE_REMOVE;
                                });
                            }
                            return GLib.SOURCE_REMOVE;
                         });
                    }
                 });

                 // 2. Define o foco inicial SE a janela já estiver visível
                 // (Isso é menos provável de causar o erro aqui, mas ainda é bom verificar)
                 if (windowWidget.visible) {
                      console.log("[Launcher] Window initially visible. Grabbing focus."); // Log
                      // Usa delay aqui também por segurança
                      GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
                          if (entryRef) entryRef.grab_focus();
                          return GLib.SOURCE_REMOVE;
                      });
                 }
            }}
            // --- Fim do setupWindow ---
        />
    );
};
