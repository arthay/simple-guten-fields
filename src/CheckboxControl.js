const {
  components: { CheckboxControl },
  data: { dispatch, useSelect },
  element: { useCallback }
} = wp;

const CheckboxControlField = ({
  field: { label, meta_key }, row_index, property_key, isChild, values, onChange
}) => {
  const value = isChild
    ? values
    : useSelect(select => select('core/editor').getEditedPostAttribute('meta')[meta_key]);
  const key = meta_key + row_index + property_key;

  const onChangeHandler = useCallback((value) => {
    if (onChange) {
      onChange(value, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: value } });
  }, [onChange, meta_key, row_index, property_key, dispatch]);

  return (
    <CheckboxControl
      checked={value}
      key={key}
      label={`Set ${(property_key || '').replace('_', ' ') || label}`}
      onChange={onChangeHandler}
    />
  );
};

export default CheckboxControlField;
