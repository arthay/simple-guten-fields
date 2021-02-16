const {
  components: { SelectControl },
  data: { dispatch, useSelect },
  element: { useCallback }
} = wp;

const SelectControlField = ({
  field: { meta_key, options, label }, property_key, row_index, values, isChild, onChange
}) => {
  const value = isChild
    ? values
    : useSelect(select => select('core/editor').getEditedPostAttribute('meta')[meta_key]);

  const onChangeHandler = useCallback((value) => {
    if (onChange) {
      onChange(value, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: value } });
  }, [ property_key, row_index, meta_key, onChange, dispatch ]);

  return (
    <SelectControl
      label={`Set ${(property_key || '').replace('_', ' ') || label}`}
      options={options}
      value={value}
      onChange={onChangeHandler}
    />
  );
};

export default SelectControlField;
