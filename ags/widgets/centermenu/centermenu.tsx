// widgets/centermenu/centermenu.tsx
import { App, Astal, Gdk, Gtk } from "astal/gtk4"; // Gtk necessário
// Importa os módulos de conteúdo
import { Calendar } from "./modules/calendar";
import { NotificationMenu } from "./modules/notificationMenu";
// Importa o novo componente ScrimWindow
import { ScrimWindow } from "../common/ScrimWindow";

// A função local 'hide' NÃO é mais necessária aqui.
// A função global 'toggleWindow' será usada para abrir/fechar.

export const CenterMenu = () => {
  // Define o conteúdo que irá dentro da ScrimWindow
  const centerMenuContent = (
    <box
        widthRequest={400} // Largura do conteúdo
        cssClasses={["centerMenu"]} // Sua classe CSS para estilo
        vertical
    >
        <box hexpand> {/* Box para organizar lado a lado */}
            <NotificationMenu />
            <Gtk.Separator
                orientation={Gtk.Orientation.VERTICAL}
                marginStart={10}
                marginEnd={10}
            />
            <box hexpand> {/* Box para o calendário expandir */}
                <Calendar />
            </box>
        </box>
    </box>
  );

  // Usa o componente ScrimWindow
  return (
    <ScrimWindow
        name="centerMenu" // Nome importante para hideAllWindows/toggleWindow
        // Ancoragem para ocupar toda a altura (se desejado)
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        layer={Astal.Layer.TOP} // Camada apropriada
        // Posicionamento do conteúdo dentro da ScrimWindow
        child_halign={Gtk.Align.CENTER}
        child_valign={Gtk.Align.START}
        child_marginTop={20} // Margem do topo
        // Passa o conteúdo definido acima
        child={centerMenuContent}
    />
  );
};
