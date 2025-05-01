// widgets/quicksettings/modules/PowerSubMenu.tsx
import { Gtk, Gdk } from "astal/gtk4";
import { execAsync } from 'astal';
import { hideAllWindows } from "../../utils/windows"; // Importar para fechar tudo após ação

// Função auxiliar para executar um comando e fechar janelas
// Adiciona um pequeno delay antes de executar para a janela fechar visualmente
const runPowerCommand = (command: string, confirmMessage?: string) => {
    // Implementar confirmação se desejar (ex: usando um dialog)
    if (confirmMessage && !confirm(confirmMessage)) { // 'confirm' é do browser, precisa de alternativa Gtk/AGS
        console.log(`Action "${command}" cancelled.`);
        // TODO: Implementar um Dialog Gtk para confirmação em vez de confirm()
        return;
    }

    console.log(`Executing power command: ${command}`);
    hideAllWindows(); // Esconde as janelas primeiro

    // Pequeno delay para a animação de hide terminar antes do comando
    setTimeout(() => {
        execAsync(command)
            .catch(err => console.error(`Command "${command}" failed:`, err));
    }, 400); // Tempo um pouco maior que a animação de hide
};

export const PowerSubMenu = () => {
    // Referência ao Popover pai para poder fechá-lo
    let popoverRef: Gtk.Popover | null = null;

    const closePopoverAndHideAllWindows = () => {
         popoverRef?.popdown(); // Fecha o popover
         hideAllWindows(); // Fecha o menu principal
    }

    return (
        <box
            vertical
            cssClasses={['power-submenu']} // Adicione estilo para este submenu
            spacing={5}
            // Obtém referência ao Popover pai
            setup={box => popoverRef = box.get_ancestor(Gtk.Popover.$gtype) as Gtk.Popover | null}
        >
            {/* Botão Desligar */}
            <button
                onClicked={() => {
                    // runPowerCommand('systemctl poweroff', 'Are you sure you want to shut down?');
                    console.log("Shutdown action clicked (implement command + confirmation)");
                     closePopoverAndHideAllWindows(); // Fecha tudo
                }}
                tooltipText="Shut Down"
            >
                <box spacing={10} halign={Gtk.Align.START}>
                    <image iconName="system-shutdown-symbolic" />
                    <label>Shut Down</label>
                </box>
            </button>

            {/* Botão Reiniciar */}
            <button
                 onClicked={() => {
                    // runPowerCommand('systemctl reboot', 'Are you sure you want to reboot?');
                    console.log("Reboot action clicked (implement command + confirmation)");
                     closePopoverAndHideAllWindows(); // Fecha tudo
                }}
                tooltipText="Restart"
            >
                 <box spacing={10} halign={Gtk.Align.START}>
                    <image iconName="system-reboot-symbolic" />
                    <label>Restart</label>
                </box>
            </button>

             {/* Botão Suspender (Opcional) */}
            <button
                 onClicked={() => {
                    // runPowerCommand('systemctl suspend'); // Geralmente não precisa de confirmação
                    console.log("Suspend action clicked (implement command)");
                     closePopoverAndHideAllWindows(); // Fecha tudo
                }}
                 tooltipText="Suspend"
            >
                 <box spacing={10} halign={Gtk.Align.START}>
                    <image iconName="system-suspend-symbolic" />
                    <label>Suspend</label>
                </box>
            </button>

             {/* Botão Sair/Logout (Opcional) */}
             <button
                 onClicked={() => {
                    // runPowerCommand('loginctl terminate-user $USER', 'Are you sure you want to log out?'); // Comando pode variar
                    console.log("Logout action clicked (implement command + confirmation)");
                     closePopoverAndHideAllWindows(); // Fecha tudo
                 }}
                 tooltipText="Log Out"
            >
                 <box spacing={10} halign={Gtk.Align.START}>
                    <image iconName="system-log-out-symbolic" />
                    <label>Log Out</label>
                </box>
            </button>

             {/* Botão Bloquear Tela (Opcional) */}
             <button
                 onClicked={() => {
                     // runPowerCommand('your-screen-locker-command'); // Ex: 'swaylock', 'betterlockscreen -l', etc.
                     console.log("Lock screen action clicked (implement command)");
                     // Geralmente não fecha os menus ao bloquear
                     popoverRef?.popdown();
                 }}
                 tooltipText="Lock Screen"
             >
                 <box spacing={10} halign={Gtk.Align.START}>
                    <image iconName="system-lock-screen-symbolic" />
                    <label>Lock Screen</label>
                 </box>
             </button>

        </box>
    );
};
