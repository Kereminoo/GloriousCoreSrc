import { KeyboardKeyAssignmentData } from "@renderer/data/legacy/keyboard-data";
import { UIDevice } from "@renderer/data/ui-device";
import { iconSrc, ICONS } from "./icons";
import { AdvancedKeyMode } from "../../../src/common/data/valueC-data";

export const getDynamicKeysApplied = (previewDevice: UIDevice | undefined) => {
    if (!previewDevice) {
        return null;
    }

    const profileIndex = previewDevice!.keyboardData!.profileindex;
    const profileLayerIndex = previewDevice!.keyboardData!.profileLayerIndex[profileIndex];
    const keyboardArray = previewDevice!.keyboardData!.profileLayers[profileIndex][profileLayerIndex].assignedKeyboardKeys[0];
    return keyboardArray.filter((key: KeyboardKeyAssignmentData) => !!key.valueCKeyData);
}

export const resolveProfileStoredAdvancedKeysType = (valueCKeyData) => {
    const { DynamicKeystrokeData, ModTapData, ToggleData } = valueCKeyData;

    if (DynamicKeystrokeData) {
        return AdvancedKeyMode.DynamicKeystroke;
    } else if (ModTapData) {
        return AdvancedKeyMode.ModTap;
    } else if (ToggleData) {
        return AdvancedKeyMode.Toggle;
    }
    return AdvancedKeyMode.None;
}

export const getDynamicKeysDetailsWithIcons = (previewDevice: UIDevice | undefined) => {
   return getDynamicKeysApplied(previewDevice)?.map(({ defaultValue, valueCKeyData }) => {
        const { DynamicKeystrokeData, ModTapData, ToggleData } = valueCKeyData;
        let bindingTypeIconSrc: string | undefined;
        let bindings: string | undefined;

        if (DynamicKeystrokeData) {
            bindingTypeIconSrc = iconSrc(ICONS.dynamicKeystroke)
            bindings = DynamicKeystrokeData.map(({ assignedKey }) => assignedKey).join(', ');
        } else if (ModTapData) {
            bindingTypeIconSrc = iconSrc(ICONS.modTap);
            bindings = ModTapData.tapAction;
        } else if (ToggleData) {
            bindingTypeIconSrc = iconSrc(ICONS.toggleKey);
            bindings = ToggleData.toggleAction;
        }
        return {
            keyName: defaultValue,
            bindingTypeIconSrc,
            bindings,
        }
    }) ?? [];
}

export const getBindingModeIcon = (advancedKeyMode: AdvancedKeyMode) => {
    switch (advancedKeyMode) {
        case AdvancedKeyMode.ModTap:
            return iconSrc(ICONS.modTap);
        case AdvancedKeyMode.Toggle:
            return iconSrc(ICONS.toggleKey);
        case AdvancedKeyMode.DynamicKeystroke:
            return iconSrc(ICONS.dynamicKeystroke);
        default:
            return null;
    }
}

export const gaugeValueToFixedNumber = (value: number | null | undefined) => {
    if (value == null) return 0;
    return (value * 0.01 * 4).toFixed(1);
};

export const cleanupKeyName = (keyName: string | null | undefined) => {
    if (!keyName) return '';
    return keyName.replace('Key', '')?.replace('Digit', '');
};
