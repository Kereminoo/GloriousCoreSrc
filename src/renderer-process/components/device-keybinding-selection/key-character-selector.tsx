import {DeviceInputLayoutMap} from '../../../common/data/device-input-layout.data';
import './key-character-selector.css';
import {useState, useEffect} from 'react';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import {useTranslate} from '../../contexts/translations.context';

const removeKeyType = (key) => key.replace('Key', '').replace('Digit', '');
function KeyCharacterSelector({previewDevice, onKeySelect, onClose, position = 'absolute'}) {
  const [selectedKey, setSelectedKey] = useState(null);
  const translate = useTranslate();
  useEffect(() => {
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const getKeySectionsObject = () => {
    if (previewDevice) {
      // const deviceInputLayout: any = DeviceInputLayoutData[previewDevice.SN];
      const deviceInputLayout = DeviceInputLayoutMap.get(previewDevice.SN);
      const letters: any[] = [];
      const numbers: any[] = [];
      const fkeys: any[] = [];
      const others: any[] = [];
      deviceInputLayout.layoutNodes.forEach(key => {
        if (key.translationKey.startsWith('Key')) {
          letters.push(key);
        } else if (key.translationKey.startsWith('Digit')) {
          numbers.push(key);
        } else if (key.translationKey.startsWith('F')) {
          fkeys.push(key);
        } else {
          others.push(key);
        }
      })
      const keySections = {
        Letters: letters,
        Numbers: numbers,
        FunctionKeys: fkeys,
        Others: others
      }
      return keySections;
    }
  }

  return (
    <div className='keys-character-selector-modal' style={{position: position ?? 'absolute'}}>
      <div className='keys-header'>
        <div>
          <h3>{translate('Keybinding_Key_Character_Selector_Label', 'Character Selector')}</h3>
          <p>{translate('Keybinding_Key_Character_Selector_Description', 'Choose a character from below to assign to your selected field, then confirm your choice')}</p>
        </div>
        <div className='key-character-selector-actions'>
          <div>
            <div className='key-character'>{selectedKey && removeKeyType(selectedKey.translationKey)}</div>
          </div>
          <div>
            <div
              className='save-key-character-selection'
              style={{
                pointerEvents: selectedKey ? 'initial' : 'none',
                cursor: selectedKey ? 'pointer' : 'initial'
              }}
              onClick={() => {
                onKeySelect(selectedKey);
                setSelectedKey(null);
              }}>
              <span></span>
            </div>
            <div className='close-keys-character-selector-modal' onClick={onClose}>
              <SVGIconComponent src={'/images/icons/close.svg'}/>
            </div>
          </div>
        </div>
      </div>
      <div className='key-sections-container'>
        {Object.entries(getKeySectionsObject()).map(([sectionName, items]) => (
          <div className='key-section' key={sectionName}>
            <h2>{sectionName}</h2>
            <div className='keys-container'>
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`key-button ${selectedKey === item && 'active'}`}
                  onClick={() => setSelectedKey(item)}>
                  <p>
                    {removeKeyType(item.translationKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeyCharacterSelector
