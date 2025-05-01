// common/ScrimWindow.tsx
import { App, Astal, Gdk, Gtk, Overlay } from "astal/gtk4";
import { hideAllWindows } from "../utils/windows";
import { GLib } from 'astal'; // Importar GLib se usar timeout em hideAllWindows

type ScrimWindowParams = {
    name: string;
    anchor?: Astal.WindowAnchor;
    exclusivity?: Astal.Exclusivity;
    layer?: Astal.Layer;
    child: JSX.Element;
    child_halign?: Gtk.Align;
    child_valign?: Gtk.Align;
    child_marginTop?: number;
    child_marginBottom?: number;
    child_marginStart?: number;
    child_marginEnd?: number;
    setupWindow?: (window: Gtk.Window) => void;
};

export function ScrimWindow(
    {
        name,
        anchor = Astal.WindowAnchor.TOP,
        exclusivity = Astal.Exclusivity.IGNORE,
        layer = Astal.Layer.TOP,
        child,
        child_halign = Gtk.Align.CENTER,
        child_valign = Gtk.Align.START,
        child_marginTop = 0,
        child_marginBottom = 0,
        child_marginStart = 0,
        child_marginEnd = 0,
        setupWindow
    }: ScrimWindowParams
) {
    let contentBoxRef: Gtk.Widget | null = null;

    return (
        <window
            name={name}
            anchor={anchor}
            application={App}
            visible={false}
            exclusivity={exclusivity}
            layer={layer}
            keymode={Astal.Keymode.ON_DEMAND}
            cssClasses={["transparentBackground"]}
            onKeyPressed={(_, keyval) => {
                if (keyval === Gdk.KEY_Escape) { hideAllWindows(); }
            }}
            // Setup para o clique fora
            setup={(winWidget) => {
                const gesture = new Gtk.GestureClick();

                // --- ALTERAÇÃO CRUCIAL AQUI ---
                // Define a fase de propagação para BUBBLE.
                // O gesto só agirá DEPOIS dos widgets filhos.
                gesture.set_propagation_phase(Gtk.PropagationPhase.BUBBLE);
                // --- FIM DA ALTERAÇÃO ---

                // Usaremos o sinal 'released' que acontece após o evento completo
                gesture.connect('released', (_gesture, _n_press, x, y) => {
                    // Verifica se contentBoxRef foi definido e se o clique foi tratado por um filho
                    // Se event.is_stopping() for true, um filho consumiu o evento.
                    // (Nota: Acessar o evento exato aqui pode ser complexo, vamos simplificar)

                    // Simplificação: Assume que se chegamos aqui, nenhum filho relevante tratou.
                    // Agora, verifica as coordenadas.
                    if (!contentBoxRef) return;
                    const [_, childX, childY] = contentBoxRef.translate_coordinates(winWidget, 0, 0);
                    const allocation = contentBoxRef.get_allocation();
                    const clickInsideContent =
                        x >= childX && x <= childX + allocation.width &&
                        y >= childY && y <= childY + allocation.height;

                    // Se o clique NÃO foi dentro do conteúdo, fecha tudo
                    if (!clickInsideContent) {
                        // console.log(`Click outside ${name} content - hiding all.`); // Debug
                        hideAllWindows();
                    } else {
                         // console.log(`Click inside ${name} content - ignoring in gesture.`); // Debug
                    }
                });
                winWidget.add_controller(gesture);
            }}
        >
            {/* Revealer e Overlay como antes */}
            <revealer transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}>
                <overlay hexpand vexpand>
                    {/* 1. Fundo */}
                    <box hexpand vexpand cssClasses={['scrimBackground']} />
                    {/* 2. Conteúdo */}
                    <box
                        halign={child_halign} valign={child_valign}
                        marginTop={child_marginTop} marginBottom={child_marginBottom}
                        marginStart={child_marginStart} marginEnd={child_marginEnd}
                        setup={widget => contentBoxRef = widget} // Obtém referência
                    >
                        {child} {/* Renderiza o conteúdo */}
                    </box>
                </overlay>
            </revealer>
        </window>
    );
}
