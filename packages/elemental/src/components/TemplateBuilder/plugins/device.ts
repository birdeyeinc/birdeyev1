import type { Editor } from 'grapesjs';

function loadDevices(editor: Editor, _opts?: Record<string, unknown>) {
    editor?.Devices?.add({
        id: "mobile-415",
        name: "Mobile 415",
        width: "415px"
    });
}



export default loadDevices;