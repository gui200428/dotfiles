import { bind, Variable } from 'astal';
import AstalHyprland from 'gi://AstalHyprland';
import Gtk from 'gi://Gtk?version=4.0';

const hyprland = AstalHyprland.get_default();

/*export const Workspaces = () =>
  <box 
    
    cssClasses={['workspaceList']}
    onScroll={(_, __, y) => hyprland.dispatch('workspace', y > 0 ? '+1' : '-1')}
  >
  {bind(hyprland, 'workspaces').as(() => {
    return Array.from({length: 7}, (_, i) => i + 1).map((id) => {
      const workspace = hyprland.workspaces.find((w) => w.id === id);
      const isOccupied = workspace ? workspace.get_clients().length > 0 : false;
      
      return (
        <button
          onClicked={() => workspace ? workspace.focus() : hyprland.dispatch('workspace', `${id}`)}
          cssClasses={bind(hyprland, 'focusedWorkspace').as((fw) => [
            'workspaceBtn',
            ...(fw?.id === id ? ['active'] : []),
            ...(isOccupied ? ['occupied'] : [])
          ])}
        >
          {id}
        </button>
      );
    });
  })}
</box>*/
const workspacesBinding = bind(hyprland, 'workspaces');
const focusedWorkspaceBinding = bind(hyprland, 'focusedWorkspace');

// A variável derivada permanece a mesma
const workspaceState = Variable.derive(
  [workspacesBinding, focusedWorkspaceBinding],
  (wsList, focusedWs) => {
    const workspaceMap = new Map(wsList.map(w => [w.id, w]));
    const currentFocusedId = focusedWs?.id ?? 0;
    const existingIds = new Set(workspaceMap.keys());
    const maxExistingId = Math.max(...existingIds, 0);
    const highestRelevantId = Math.max(maxExistingId, currentFocusedId, 7); // Mínimo 7

    const buttonsState = Array.from({ length: highestRelevantId }, (_, i) => {
      const id = i + 1;
      const workspace = workspaceMap.get(id);
      const isOccupied = workspace ? workspace.get_clients().length > 0 : false;
      const isActive = currentFocusedId === id;
      const cssClasses = [
        'workspaceBtn',
        ...(isActive ? ['active'] : []),
        ...(isOccupied ? ['occupied'] : []),
        ...(!workspace && !isActive ? ['empty'] : []),
      ];
      return { id, cssClasses };
    });
    return buttonsState;
  }
);

// --- O Componente ---
export const Workspaces = () => {
  return (
    <box
      cssClasses={['workspaceList']}
      onScroll={(_, __, y) => hyprland.dispatch('workspace', y > 0 ? '+1' : '-1')}
    >
      {/* A Mudança Chave: Bind à propriedade 'value' da Variable derivada */}
      {/* Astal deve vincular ao valor interno da Variable e fornecer acesso a ele */}
      {bind(workspaceState, 'value').as(buttons => { // 'buttons' é o array calculado
        // Verifica se 'buttons' é realmente um array (pode ser undefined inicialmente)
        if (!Array.isArray(buttons)) {
          return null; // Ou um estado de carregamento/vazio
        }
        // O callback continua simples
        return buttons.map(buttonState => (
          <button
            key={buttonState.id}
            onClicked={() => hyprland.dispatch('workspace', `${buttonState.id}`)}
            cssClasses={buttonState.cssClasses}
          >
            {buttonState.id}
          </button>
        ));
      })}
    </box>
  );
}
