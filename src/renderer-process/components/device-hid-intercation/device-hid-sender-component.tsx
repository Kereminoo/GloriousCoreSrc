import './device-hid-sender-component.css';
import { createRef, useState } from 'react';
import { IPCService } from '../../services/ipc.service';
import { MessageChannels } from '../../../common/channel-maps/MessageChannels';

// defaults are set for valueC
const defaultVID = 0x3151;
const defaultPID = 0x4035;
const defaultReportID = 0x00;
const defaultUsage = 0x0002;
const defaultUsagePage = 0xffff;
const minimumCommandLength = 7;
const defaultCommandLength = 8;

function HidReportSenderComponent() {
    const [vid, setVID] = useState(defaultVID);
    const [pid, setPID] = useState(defaultPID);
    const [usage, setUsage] = useState(defaultUsage);
    const [usagePage, setUsagePage] = useState(defaultUsagePage);
    const [reportID, setReportID] = useState(defaultReportID);
    const [report, setReport] = useState<Array<number>>([]);
    const [messageParts, setMessageParts] = useState<Array<string>>(new Array(defaultCommandLength).fill(''));
    const inputRefs = new Array(8).fill(0).map(() => createRef<HTMLInputElement>());

    const handlePartChange = (index: number, part: string) => {
        if (!isHex(part)) return; // Add this line
        const newParts = [...messageParts];
        newParts[index] = part;
        setMessageParts(newParts);
        if (isHex(part)) {
            setReport(toByteArray(newParts.join('')));

            if (part.length === 2 && index < defaultCommandLength) {
                inputRefs[index + 1].current?.focus(); // Focus the next input field
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && event.currentTarget.value === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleMessageChange = (message: string) => {
        const parts = message.match(/.{1,2}/g) || [];
        while (parts.length < defaultCommandLength) parts.push('');
        setMessageParts(parts);
        if (isHex(message)) {
            setReport(toByteArray(message));
        }
    };

    const isHex = (value: string) => {
        const re = /^[0-9A-Fa-f]*$/g;
        return re.test(value);
    };

    const toHexNumber = (value: string) => {
        return isHex(value) ? parseInt(value, 16) : 0;
    };

    // Convert a message to an array of 8-byte hex strings
    const toByteArray = (value: string) => {
        let byteArray: number[] = [];
        for (let i = 0; i < value.length - 1; i += 2) {
            const token = value.slice(i, i + 2);
            byteArray.push(parseInt(token, 16));
        }
        return byteArray;
    };

    const send = async () => {
        if (report.length < minimumCommandLength) return;

        const data = { vid: vid, pid: pid, usagePage: usagePage, usage: usage, reportID: reportID, report: report };
        const response = await IPCService.invoke(MessageChannels.DeviceChannel.DeviceSendHidReport, data);
        if (response.success) {
            console.log('success, bytes written: ', response.data);
        } else {
            console.log('failure: ', response.data);
        }
    };

    const getValidColor = (val: any[]) => {
        console.log(val.length);
        return val.length >= minimumCommandLength ? '#67c900' : 'black';
    };

    return (
        <div>
            <label>
                <h3>Send Report To HID Device</h3>
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="DeviceDescription">
                    <label className="label-flex">
                        <span className="label-span">ReportID:</span>
                        <input
                            type="text"
                            style={{ width: '2em' }}
                            value={reportID.toString(16)}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isHex(val) && val.length <= 2) setReportID(toHexNumber(val.toUpperCase()));
                            }}
                        />
                    </label>
                    <br />
                    <label className="label-flex">
                        <span className="label-span">VID:</span>
                        <input
                            type="text"
                            className="input-small-width"
                            value={vid.toString(16) == 'NaN' ? '' : vid.toString(16)}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isHex(val) && val.length <= 4) setVID(toHexNumber(val.toUpperCase()));
                            }}
                        />
                    </label>
                    <label className="label-flex">
                        <span className="label-span">PID:</span>
                        <input
                            type="text"
                            className="input-small-width"
                            value={pid.toString(16) == 'NaN' ? '' : pid.toString(16)}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isHex(val) && val.length <= 4) setPID(toHexNumber(val.toUpperCase()));
                            }}
                        />
                    </label>
                    <br />
                    <label className="label-flex">
                        <span className="label-span">Usage:</span>
                        <input
                            type="text"
                            className="input-small-width"
                            value={usage.toString(16) == 'NaN' ? '' : usage.toString(16)}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isHex(val) && val.length <= 4) setUsage(toHexNumber(val.toUpperCase()));
                            }}
                        />
                    </label>
                    <label className="label-flex">
                        <span className="label-span">Usage Page:</span>
                        <input
                            type="text"
                            className="input-small-width"
                            value={usagePage.toString(16) == 'NaN' ? '' : usagePage.toString(16)}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isHex(val) && val.length <= 4) setUsagePage(toHexNumber(val.toUpperCase()));
                            }}
                        />
                    </label>
                </div>
                <div className="Message">
                    <div>
                        <label>Message:</label>
                        <br />
                        <div>
                            {messageParts.map((part, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    ref={inputRefs[index]}
                                    value={part}
                                    maxLength={2}
                                    style={{ width: '2em' }}
                                    onChange={(e) => handlePartChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                        <input
                            type="text"
                            value={messageParts.join('')}
                            onChange={(e) => handleMessageChange(e.target.value)}
                            style={{ color: getValidColor(report), width: `${2 * messageParts.length}em` }}
                        />
                    </div>
                </div>
                <button onClick={send} disabled={report.length < minimumCommandLength}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default HidReportSenderComponent;
