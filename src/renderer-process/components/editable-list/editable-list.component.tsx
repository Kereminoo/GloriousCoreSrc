import { useEffect, useState } from 'react';
import './editable-list.component.css';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';
import { Color } from '../component.types';

function EditableListComponent(props: {
    items: { label: string; id?: any }[];
    onChange?;
    onClick?;
    className?;
    onButtonClick?: (action: string, item: any, index: number) => void;
    editIcon?;
    removeIcon?;
    noItemsMessage?;
    externalEditor?: boolean;
    selectedID?: any;
}) {
    const {
        className,
        items,
        onButtonClick,
        onClick,
        onChange,
        editIcon,
        removeIcon,
        noItemsMessage,
        externalEditor,
        selectedID,
    } = props;

    const [_items, set_items] = useState<{ label: string; id?: any }[]>([]);

    const [showInputIndex, setShowInputIndex] = useState(-1);

    useEffect(() => {
        console.log('selectedId', selectedID)
        set_items(items);
    }, [items, selectedID]);

    return (
        <div className={`editable-list${className == null ? '' : ' ' + className}`}>
            {_items == null || _items.length == 0
                ? noItemsMessage ?? <span>No Items</span>
                : _items.map((item, i) => {
                      return (
                          <li
                              className={(_items[i].id == selectedID) ? 'selected' : undefined}
                              key={i}
                              onClick={() => {
                                  if (onClick != null) {
                                      onClick(_items[i], i);
                                  }
                              }}
                          >
                              {showInputIndex == i ? (
                                  <input
                                      type="text"
                                      defaultValue={item.label}
                                      autoFocus={true}
                                      onKeyDown={(event) => {
                                          if (event.code == 'Tab' || event.code == 'Enter') {
                                              event.stopPropagation();
                                              event.preventDefault();
                                              setShowInputIndex(-1);
                                              if (onChange != null) {
                                                  onChange(event.currentTarget.value, item);
                                              }
                                              return;
                                          }
                                      }}
                                      onKeyUp={(event) => {
                                          if (event.code != 'Tab' && event.code != 'Enter') {
                                              item.label = event.currentTarget.value;
                                          }
                                      }}
                                  />
                              ) : (
                                  <span className="label" title={(item as any).label ?? 'No Label'}>
                                      {(item as any).label ?? 'No Label'}
                                  </span>
                              )}
                              <span className="actions">
                                  <button
                                      className="edit"
                                      title={showInputIndex == i ? 'Save' : 'Edit'}
                                      onClick={() => {
                                          if (!externalEditor) {
                                              if (showInputIndex == -1) {
                                                  setShowInputIndex(i);
                                              } else {
                                                  setShowInputIndex(-1);
                                              }
                                          }
                                          if (onButtonClick) {
                                              onButtonClick('edit', item, i);
                                          }
                                      }}
                                  >
                                      {editIcon != null ? (
                                          editIcon
                                      ) : showInputIndex != i ? (
                                        <Icon type={IconType.Edit} size={IconSize.XSmall} color={Color.Base20} />
                                      ) : (
                                        <Icon type={IconType.SuccessCheck} size={IconSize.XSmall} color={Color.Base20} hoverColor={Color.Glorange60} />
                                      )}
                                  </button>
                                  <button
                                      className="remove"
                                      title="Delete"
                                      onClick={() => {
                                          if (onButtonClick == null) {
                                              return;
                                          }
                                          onButtonClick('remove', item, i);
                                      }}
                                  >
                                      {removeIcon != null ? (
                                          removeIcon
                                      ) : (
                                        <Icon type={IconType.Trash} size={IconSize.XSmall} color={Color.Base20} />
                                      )}
                                  </button>
                              </span>
                          </li>
                      );
                  })}
        </div>
    );
}

export default EditableListComponent;
