// widgets/quicksettings/poweroptions.tsx
import { Astal, App, Gdk, Gtk } from 'astal/gtk4'; // Adicionado bind
import { execAsync, bind } from 'astal'; // Removido timeout se não usado
// --- IMPORTA A VARIÁVEL ---
import { powerOptionsVisible } from './variables'; // Ajuste o caminho se necessário

export const PowerOptions = () => {
    // A variável agora vem de fora

    // Função auxiliar (similar à anterior, mas local)
    const runPowerCommand = (command: string) => {
        console.log(`Executing power command: ${command} from PowerOptions`);
        // Nota: Chamar hideAllWindows() daqui pode ser redundante se o clique
        // no botão também fechar o QuickSettings principal. Testar.
        // hideAllWindows(); // <-- Pode não precisar chamar aqui

        // Pequeno delay opcional
        setTimeout(() => {
            execAsync(command)
                .catch(err => console.error(`Command "${command}" failed:`, err));
        }, 100); // Delay menor aqui
    };


    return (
        <revealer
            // --- USA A VARIÁVEL IMPORTADA ---
            revealChild={bind(powerOptionsVisible)}
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN} // SLIDE_DOWN pode ser mais natural aqui
            // Adiciona uma classe para poder estilizar o revealer se necessário
            cssClasses={['power-options-revealer']}
        >
            {/* Conteúdo do PowerOptions (como antes) */}
            <box
                name="poweroptions"
                vertical
                hexpand
                cssClasses={['powerOptions']} // Sua classe CSS
            >
                <box marginBottom={15} spacing={10}> {/* Adicionado spacing */}
                    <image iconName="system-shutdown-symbolic" cssClasses={['powerButtonIcon']} /> {/* Classe mais específica */}
                    <label cssClasses={['powerMenuTitle']}>Power Menu</label>
                </box>
                <button
                    cursor={Gdk.Cursor.new_from_name('pointer', null)}
                    // --- Definir Comandos Reais ---
                    onClicked={() => runPowerCommand('systemctl poweroff')} // Exemplo: Desligar
                    tooltipText="Shut Down"
                >
                    <label halign={Gtk.Align.START}>Power off</label>
                </button>
                <button
                    cursor={Gdk.Cursor.new_from_name('pointer', null)}
                     // --- Definir Comandos Reais ---
                    onClicked={() => runPowerCommand('systemctl reboot')} // Exemplo: Reiniciar
                    tooltipText="Restart"
                >
                    <label halign={Gtk.Align.START}>Reboot</label>
                </button>
                <button
                    cursor={Gdk.Cursor.new_from_name('pointer', null)}
                     // --- Definir Comandos Reais ---
                    onClicked={() => runPowerCommand('systemctl suspend')} // Exemplo: Suspender
                    tooltipText="Sleep"
                >
                    <label halign={Gtk.Align.START}>Sleep</label>
                </button>
                 {/* Adicione outros botões (Logout, Lock) se desejar, com seus comandos */}
            </box>
        </revealer>
    )
}
