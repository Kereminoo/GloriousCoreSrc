import {useEffect, useRef, useState} from "react";
import {IPCService} from "../../services/ipc.service";
import {AppChannel} from "../../../common/channel-maps/AppChannel.map";

function FirmwareSelectorComponent() {
    interface optionType {
        name: string,
        path: string
    }

    const [options, setOptions] = useState<optionType[]>([])
    const [selected, setSelected] = useState(Number)
    const inputFile = useRef<HTMLInputElement>(null);

    const optionChanged = async (index: number) => {
        if (index === 0) {
            // Set default firmware
            setSelected(index);
            firmwareOverrideSelected(null);
        } else if (index === options.length - 1) {
            // Select firmware file
            inputFile?.current?.click();
        } else {
            // Use previously selected file
            setSelected(index);
            firmwareOverrideSelected(options[index]);
        }
    };
    const fileSelected = (file: File | null | undefined) => {
        if (file && file.name != "") {
            const position = options.length - 1;
            const fileData: optionType = {name: file.name, path: file.path};
            options.splice(position, 0, fileData);
            setSelected(position);
            firmwareOverrideSelected(fileData).then(r => console.log(r.data));
        }
    };
    const firmwareOverrideSelected = async (file: { name: string, path: string } | null) => {
        const fileArray = file ? [file] : null;
        const res = await IPCService.invoke(AppChannel.SetFirmwareOverrides, fileArray);
        if (!res.success) {
            console.log("Failed to set firmware override files!")
        }
        return res;
    };

    useEffect(() => {
        if (!options || options.length == 0) {
            setOptions([{name: "Default (Use url)", path: ""}, {name: "Select firmware file...", path: ""}]);
        }
    }, [])

    return <>
        <header>Firmware Selector</header>
        <select value={selected} onChange={(e) => optionChanged(e.target.selectedIndex)}>
            {options && options.map((value, index) => (<option key={index} value={index}>{value.name}</option>))}
        </select>
        <input type='file' id='file' ref={inputFile} style={{display: 'none'}} multiple={false} accept=".zip,.exe"
               onChange={(e) => {
                   fileSelected(e.target.files?.item(0))
               }}/>
    </>
}

export default FirmwareSelectorComponent
