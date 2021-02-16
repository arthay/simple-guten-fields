import Select, { components } from 'react-select';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMove } from "./utils";

const {
  data: { dispatch, useSelect },
  element: { useCallback }
} = wp;

const SortableMultiValue = SortableElement(props => {
  const onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { onMouseDown };

  return <components.MultiValue {...props} innerProps={innerProps}/>;
});

const SortableSelect = SortableContainer(Select);

const MultiSelectField = ({
  field: { label, meta_key, options, isMulti },
  row_index,
  property_key,
  values,
  isChild,
  onChange
}) => {
  values = isChild
    ? values
    : useSelect(select => select('core/editor').getEditedPostAttribute('meta')[meta_key]);

  const key = meta_key + row_index + property_key;

  const defaultValue = Array.isArray(values) ? values.map(value => {
    const isOption = options.find(option => option.value == value);
    let label = values;

    if (typeof isOption === 'object' && isOption !== null) {
      label = isOption.label;
    }
    return { value, label };
  }) : [];

  const onChangeHandler = useCallback((value) => {
    let flatArray = [];
    if (Array.isArray(value)) {
      flatArray = value.map(option => option.value);
    } else {
      // When is multi false we saving the value in array of 1 item to beep the data type array
      flatArray = [ value.value ];
    }

    let newValue = flatArray;
    // In repeater fields we setting the value on the parent meta value before update

    if (onChange) {
      onChange(newValue, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: newValue } });
  }, [onChange, property_key, row_index, meta_key, dispatch]);

  const onSortEndHandler = useCallback(({ oldIndex, newIndex }) => {
    const newValues = arrayMove(values, oldIndex, newIndex);

    if (onChange) {
      onChange(newValues, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: newValues } });
  }, [values, onChange, property_key, row_index, meta_key]);

  return (
    <SortableSelect
      axis='xy'
      distance={4}
      isMulti={isMulti ?? true}
      placeholder={label}
      value={defaultValue}
      key={key}
      options={options}
      label={`Set ${label}`}
      components={{ MultiValue: SortableMultiValue }}
      onChange={onChangeHandler}
      onSortEnd={onSortEndHandler}
    />
  );
};

export default MultiSelectField;
