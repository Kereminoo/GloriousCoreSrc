import { useEffect, useRef, useState, useCallback } from 'react';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import KeyboardKeySelectionComponent from './keyboard-key-selection.component';
import { useDevicesManagementContext } from '../../contexts/devices.context';

function KeyboardActuationBindingSelectionComponent(props: any) {
    const { valueCState } = useUIContext();
    const { setvalueCState } = useDevicesManagementContext();
    const [count, setCount] = useState(0);

    const handleNodeClick = useCallback(
        ({ nodeDefinition, index }) => {
            if (!valueCState.isActuationPerKey && !valueCState.isRapidTriggerPerKey)
                return;

            if (valueCState.actuationSelectedNodes.current.length <= 1) {
                valueCState.actuationSelectedNodes.current = [
                    ...valueCState.actuationSelectedNodes.current,
                    {
                        nodeDefinition,
                        index,
                    },
                ];
            }
            // TODO: should use valueCUIKeyState
            if (valueCState.actuationSelectedNodes.current.length === 1) {
                valueCState.actuationSelectedNodes.layers.push({
                    nodes: [...valueCState.actuationSelectedNodes.current],
                    actuationPress: valueCState.isActuationPerKey ? valueCState.actuationTmpPress : undefined,
                    rapidTriggerPress: valueCState.isRapidTriggerPerKey
                        ? valueCState.rapidTriggerTmpPress
                        : undefined,
                });
                valueCState.actuationSelectedNodes.current = [];
            }
            setvalueCState(valueCState);
        },
        [valueCState.actuationSelectedNodes, valueCState.actuationTmpPress, valueCState.rapidTriggerTmpPress],
    );

    return (
      <KeyboardKeySelectionComponent
          selectedNodes={valueCState.actuationSelectedNodes.current}
          className="actuation-selection keyboard"
          onNodeClick={handleNodeClick}
          selectionMode="multiple"
      />
    );
}

export default KeyboardActuationBindingSelectionComponent;
