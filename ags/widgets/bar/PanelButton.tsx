import { Gtk } from "astal/gtk4";
import { ButtonProps } from "astal/gtk4/widget";

type PanelButtonProps = ButtonProps & {
    window?: string
    flat?: boolean
    child?: Gtk.Widget
}

export default function PanelButton(props: PanelButtonProps) {
    const { window, flat, child, ...buttonProps } = props

    return <button {...buttonProps}>
        {child}
    </button>
}