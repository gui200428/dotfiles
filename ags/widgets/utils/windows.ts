// utils/windows.ts
import { App, Gtk } from "astal/gtk4";
import { GLib } from 'astal';

const AFFECTED_WINDOW_NAMES = [ "centerMenu", "quickSettings", "launcher" ];
const CSS_ANIMATION_DURATION = 300; // ms - A duração REAL da sua animação em CSS (.fade-out2)

// NOVO: Tempo extra para garantir que saiu da tela ANTES de esconder.
// Ajuste este valor se necessário. Se a animação CSS dura 300ms,
// talvez 400ms ou 500ms seja suficiente para o movimento visual terminar.
const HIDE_DELAY = CSS_ANIMATION_DURATION ; // Ex: 450ms

let hideTimeoutId: number | null = null;

export function hideAllWindows() {
    if (hideTimeoutId !== null) { return; } // Evita múltiplas chamadas

    const windowsToHide = App.get_windows().filter(win =>
        AFFECTED_WINDOW_NAMES.includes(win.name) && win.visible
    );

    if (windowsToHide.length === 0) return;

    console.log(`[Windows] Hiding windows: ${windowsToHide.map(w=>w.name).join(', ')}`);

    // Aplica a classe para iniciar a animação CSS (transform + opacity)
    windowsToHide.forEach(win => {
        // Adiciona a classe para iniciar a animação VISUAL
        win.get_style_context().add_class("fade-out");
        // Desativa interação durante a animação
        win.set_sensitive(false);
        // NÃO mexemos no revealer aqui para não interferir na animação de transform
    });

    // Agenda a ocultação real APÓS um tempo MAIOR que a animação CSS
    hideTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, HIDE_DELAY, () => {
        console.log("[Windows] Hide DELAY finished. Hiding windows and resetting state.");
        windowsToHide.forEach(win => {
            if (win.visible) { // Verifica se ainda está visível
                // 1. Esconde a janela AGORA
                win.hide();

                // 2. Limpa o estado APÓS esconder
                win.get_style_context().remove_class("fade-out");
                win.set_sensitive(true);

                // 3. Garante que o revealer esteja no estado correto para a próxima vez
                const revealer = win.child as Gtk.Revealer;
                if (revealer) {
                    revealer.revealChild = false;
                }
            }
        });
        hideTimeoutId = null; // Reseta o ID do timeout
        return GLib.SOURCE_REMOVE; // Remove o timeout
    });
}

// Função showWindow (ajustada para limpar o estado de forma segura)
export function showWindow(windowName: string) {
     console.log(`[Windows] Showing window: ${windowName}`);

     // Cancela qualquer timeout de hide pendente
     if (hideTimeoutId !== null) {
          console.log("[Windows] Cancelling pending hide timeout.");
          GLib.source_remove(hideTimeoutId);
          hideTimeoutId = null;
          // Restaura estado das janelas que estavam esperando o hide
          App.get_windows().filter(win => AFFECTED_WINDOW_NAMES.includes(win.name)).forEach(win => {
               win.get_style_context().remove_class("fade-out"); // Usa nome correto da classe
               win.set_sensitive(true);
          });
     }

    // Esconde outras janelas afetadas imediatamente
    App.get_windows().filter(w =>
        w.name !== windowName && AFFECTED_WINDOW_NAMES.includes(w.name) && w.visible
    ).forEach(w => {
         console.log(`[Windows] Hiding other window: ${w.name}`);
         w.hide(); // Esconde direto
         w.get_style_context().remove_class("fade-out");
         const otherRevealer = w.child as Gtk.Revealer;
         if (otherRevealer) otherRevealer.revealChild = false; // Reseta revealer
    });


    // Mostra a janela alvo
    const win = App.get_window(windowName);
    if (!win) { console.error(`[Windows] showWindow: Window "${windowName}" not found!`); return; }

    // Garante que o estado inicial está limpo antes de mostrar
    win.get_style_context().remove_class("fade-out");
    win.set_sensitive(true);

    // Mostra a janela primeiro
    if (!win.visible) {
        win.show();
    }

    // Garante que o revealer mostre o conteúdo DEPOIS que a janela está visível
    const revealer = win.child as Gtk.Revealer;
    if (revealer) {
        // Adiciona um pequeno delay antes de revelar pode ajudar em alguns WMs
        // GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        //     revealer.revealChild = true;
        //     return GLib.SOURCE_REMOVE;
        // });
         revealer.revealChild = true; // Tenta direto primeiro
    }
}


// Função toggleWindow (sem alterações na lógica principal)
export function toggleWindow(windowName: string) {
    const win = App.get_window(windowName);
    if (!win) { console.error(`[Windows] toggleWindow: Window "${windowName}" not found!`); return; }
    const isVisible = win.visible && (hideTimeoutId === null);
    console.log(`[Windows] Toggling "${windowName}". Currently effectively visible: ${isVisible}`);
    if (isVisible) {
        hideAllWindows();
    } else {
        showWindow(windowName);
    }
}
