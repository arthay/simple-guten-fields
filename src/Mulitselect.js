import Select, { components } from 'react-select';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMove } from "./utils";

const { withSelect, select, withDispatch } = wp.data;

const SortableMultiValue = SortableElement(props => {
  const onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps}/>;
});

const SortableSelect = SortableContainer(Select);

const isRepeater = (rowIndex) => {
  return typeof rowIndex !== 'undefined';
};
let ControlField = withSelect(
  (select, {
    field: { label, meta_key, options, isMulti },
    row_index,
    property_key,
    parent_row_index,
    parent_property_key,
    isChild
  }) => {
    const values = select('core/editor').getEditedPostAttribute('meta')[meta_key];
    const key = meta_key + row_index + property_key;
    const isMultiProp = isMulti ?? true;

    if (isChild) {
      const defaultValue = values[parent_row_index][parent_property_key][row_index][property_key] && Array.isArray(values[parent_row_index][parent_property_key][row_index][property_key])
        ? values[parent_row_index][parent_property_key][row_index][property_key].map(option => {
          let labelOption = options.find(propOption => propOption.value == option);
          let label = labelOption ? labelOption.label : option;
          return { value: option, label: label };
        })
        : [];

      return {
        axis: 'xy',
        distance: 4,
        placeholder: label,
        isMulti: isMultiProp,
        value: defaultValue,
        key,
        options,
        label: `Set ${label}`,
        components: { MultiValue: SortableMultiValue }
      };
    }

    if (!isRepeater(row_index)) {
      const defaultValue = Array.isArray(values) ? values.map(item => {
        const isOption = options.find(option => option.value == item);
        let label = values;
        if (typeof isOption === 'object' && isOption !== null) {
          label = isOption.label;
        }
        return { value: item, label: label };
      }) : [];

      return {
        axis: 'xy',
        distance: 4,
        isMulti: isMultiProp,
        placeholder: label,
        value: defaultValue,
        key,
        options,
        label: `Set ${label}`,
        components: { MultiValue: SortableMultiValue }
      };
    }

    const defaultValue = values[row_index][property_key] && Array.isArray(values[row_index][property_key])
      ? values[row_index][property_key].map(option => {
        let labelOption = options.find(propOption => propOption.value == option);
        let label = labelOption ? labelOption.label : option;
        return { value: option, label: label };
      })
      : [];

    return {
      axis: 'xy',
      distance: 4,
      placeholder: label,
      isMulti: isMultiProp,
      value: defaultValue,
      key,
      options,
      label: `Set ${label}`,
      components: { MultiValue: SortableMultiValue }
    };
  }
)(SortableSelect);

ControlField = withDispatch(
  (dispatch, { field: { meta_key }, row_index, property_key, parent_row_index, parent_property_key, isChild }) => {
    return {
      onChange: (value) => {
        let flatArray = [];
        if (Array.isArray(value)) {
          flatArray = value.map(option => option.value);
        } else {
          // When is multi false we saving the value in array of 1 item to beep the data type array
          flatArray = [ value.value ];
        }

        let newValue = flatArray;
        // In repeater fields we setting the value on the parent meta value before update

        if (isChild) {
          let repeaterValues = select('core/editor').getEditedPostAttribute('meta')?.[meta_key];

          newValue = repeaterValues.map((row, innerIndex) => {
            if (innerIndex !== parent_row_index) {
              return row;
            }

            const nestedValues = row[parent_property_key].map((row, innerIndex) => {
              return innerIndex === row_index ? { ...row, [property_key]: newValue } : row;
            });

            return {
              ...row,
              [parent_property_key]: nestedValues,
            };
          });
        } else if (isRepeater(row_index)) {
          let repeaterValues = select('core/editor').getEditedPostAttribute('meta')?.[meta_key];
          newValue = repeaterValues.map((row, innerIndex) => {
            return innerIndex === row_index ? { ...row, [property_key]: newValue } : row;
          });
        }
        console.log(newValue, meta_key);
        dispatch('core/editor').editPost({ meta: { [meta_key]: newValue } });
      },

      onSortEnd: ({ oldIndex, newIndex }) => {
        let values = select('core/editor').getEditedPostAttribute('meta')?.[meta_key];

        let newValues;
        if (isChild) {
          newValues = values.map((row, innerIndex) => {
            if (innerIndex !== parent_row_index) {
              return row;
            }

            const nestedValues = row[parent_property_key].map((row, innerIndex) => {
              return innerIndex === row_index
                ? {
                  ...row,
                  [property_key]: arrayMove(row[property_key], oldIndex, newIndex)
                }
                : row;
            });

            return {
              ...row,
              [parent_property_key]: nestedValues,
            };
          });
        } else if (!isRepeater(row_index)) {
          newValues = arrayMove(values, oldIndex, newIndex);
        } else {
          newValues = values.map((row, innerIndex) => {
            return innerIndex === row_index
              ? {
                ...row,
                [property_key]: arrayMove(row[property_key], oldIndex, newIndex)
              }
              : row;
          });
        }

        dispatch('core/editor').editPost({ meta: { [meta_key]: newValues } });
      }
    };
  }
)(ControlField);

export default ControlField;
