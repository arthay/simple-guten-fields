const {
  components: { TextareaControl },
  data: { dispatch, useSelect },
  element: { useCallback }
} = wp;

const TextAreaControlField = ({
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
  }, [onChange, property_key, row_index, meta_key, dispatch]);

  return (
    <TextareaControl
      value={value}
      key={key}
      rows={20}
      label={`Set ${(property_key || '').replace('_', ' ') || label}`}
      onChange={onChangeHandler}
    />
  );
};

export default TextAreaControlField;
