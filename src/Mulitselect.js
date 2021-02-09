import Select, { components } from 'react-select';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMove } from "./utils";

const { withSelect, withDispatch } = wp.data;

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
    values,
    onSortEndHandler
  }) => {
    values = isRepeater(row_index) ? values : select('core/editor').getEditedPostAttribute('meta')[meta_key];
    const key = meta_key + row_index + property_key;
    const isMultiProp = isMulti ?? true;

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
      components: { MultiValue: SortableMultiValue },
      onSortEnd: ({ oldIndex, newIndex }) => onSortEndHandler({ oldIndex, newIndex }, values)
    };
  }
)(SortableSelect);

ControlField = withDispatch((
  dispatch,
  { field: { meta_key }, row_index, property_key, onChange }
) => ({
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

    if(onChange) {
      onChange(newValue, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: newValue } });
  },

  onSortEndHandler: ({ oldIndex, newIndex }, values) => {
    const newValues = arrayMove(values, oldIndex, newIndex);

    if (onChange) {
      onChange(newValues, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: newValues } });
  }
}))(ControlField);

export default ControlField;
