import { MacroRecord } from '../../../../../../common/data/records/macro.record';
import { KeyCodeMapping } from './valueCKeyMaps';

export enum MacroRepeatType {
    Count = 0,
    Toggle = 1,
    Hold = 2,
}

class MacroSequence {
    private static readonly attribute_delay_mask = 0b01111111;
    private static readonly attribute_press_mask = 0b10000000;
    private static readonly max_page_size = 56;
    private static readonly max_page_count = 5;
    private sequence: number[] = [];

    constructor(repeatCount: number = 1) {
        this.sequence.push(repeatCount);
        this.sequence.push(0);
    }

    // TODO: verify if actually possible, doesn't seem to work
    // addDelay(delay: number) {
    //     this.sequence.push(0x01);
    //     if (delay <= MacroSequence.attribute_delay_mask) {
    //         this.sequence.push(delay);
    //     } else {
    //         const delayLow = delay & 0xff;
    //         const delayHigh = (delay >> 4) & 0xff;
    //         this.sequence.push(0);
    //         this.sequence.push(delayLow);
    //         this.sequence.push(delayHigh);
    //     }
    // }

    add(keyName: string, press: boolean, delayAfter: number) {
        const keyCode = KeyCodeMapping[keyName];
        if (keyCode == null) {
            console.error(`Unmatched key encountered: ${keyName}`);
            return;
        }

        this.sequence.push(keyCode);
        if (delayAfter <= MacroSequence.attribute_delay_mask) {
            this.sequence.push(
                (press ? MacroSequence.attribute_press_mask : 0) | (delayAfter & MacroSequence.attribute_delay_mask),
            );
        } else {
            this.sequence.push(press ? MacroSequence.attribute_press_mask : 0);
            const delayLow = delayAfter & 0xff;
            const delayHigh = (delayAfter >> 4) & 0xff;
            this.sequence.push(delayLow);
            this.sequence.push(delayHigh);
        }
        const sequenceCount = Math.ceil(this.sequence.length / MacroSequence.max_page_size);
        if (sequenceCount > MacroSequence.max_page_count) {
            console.warn(`Macro sequence now length exceeds maximum!`);
        }
    }

    finalize() {
        this.sequence.push(0);
        this.sequence.push(0);
    }

    getBuffers() {
        const sequenceCount = Math.ceil(this.sequence.length / MacroSequence.max_page_size);
        if (sequenceCount > MacroSequence.max_page_count) {
            throw new Error(`Macro sequence too long: got ${sequenceCount} pages, max ${MacroSequence.max_page_count}`);
        }
        let buffers: Buffer[] = [];
        for (let i = 0; i < sequenceCount; i++) {
            const offset = i * MacroSequence.max_page_size;
            buffers.push(Buffer.from(this.sequence.slice(offset, offset + MacroSequence.max_page_size)));
        }
        return buffers;
    }
}

export const PrepareMacroData = (macro: MacroRecord) => {
    const content = macro.content;
    let macroEvents: { key: string; start: number; duration: number }[] = [];
    for (const obj in content) {
        const val = content[obj];
        macroEvents = macroEvents.concat(
            val.data.map((x: { inputName: string; startTime: number; endTime: number }) => {
                return {
                    key: x.inputName.replace('Key', '').replace('Digit', ''),
                    start: x.startTime,
                    duration: x.endTime - x.startTime,
                };
            }),
        );
    }

    if (macroEvents.length == 0) {
        console.warn(`PrepareMacroData: macroEvents length is 0`);
        return [];
    }

    macroEvents.sort((a, b) => a.start - b.start);

    const sequentialMacroEvents = macroEvents.flatMap((event) => {
        const pressEvent = { key: event.key, start: event.start, press: true };
        const releaseEvent = { key: event.key, start: event.start + event.duration, press: false };
        return [pressEvent, releaseEvent];
    });

    sequentialMacroEvents.sort((a, b) => a.start - b.start);
    const macroSequence = new MacroSequence();
    // macroSequence.addDelay(sequentialMacroEvents[0].start);
    for (let index = 0; index < sequentialMacroEvents.length - 1; index++) {
        const evt = sequentialMacroEvents[index];
        const evtNext = sequentialMacroEvents[index + 1];
        let delayAfter = evtNext.start - evt.start;
        if (delayAfter <= 0) {
            console.error(`Macro keystroke delay is incorrect: ${delayAfter} for keystroke ${evt}`);
            delayAfter = 1;
        }
        macroSequence.add(evt.key, evt.press, delayAfter);
    }
    // The last element's post-delay is 1 ms for now
    const evtLast = sequentialMacroEvents[sequentialMacroEvents.length - 1];
    macroSequence.add(evtLast.key, evtLast.press, 1);

    macroSequence.finalize();
    return macroSequence.getBuffers();
};

export const GenerateMacroKeyCode = (macroID: number, macroRepeatType: MacroRepeatType) => {
    return Uint8Array.from([0x09, macroRepeatType, macroID, 0]);
};


export const GetMacroRepeatType = (value: '1' | '2' | '3'): MacroRepeatType => {
    switch (value) {
        case '3':
            return MacroRepeatType.Toggle;
        case '2':
            return MacroRepeatType.Hold;
        case '1':
            return MacroRepeatType.Count;
        default:
            return MacroRepeatType.Count;
    }
};
