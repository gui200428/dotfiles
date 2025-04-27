import { bind } from 'astal';
import AstalHyprland from 'gi://AstalHyprland';

const hyprland = AstalHyprland.get_default();

export const Workspaces = () =>
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
</box>