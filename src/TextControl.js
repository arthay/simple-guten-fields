const {
  components: { TextControl },
  data: { dispatch, useSelect },
  element: { useCallback }
} = wp;

const TextField = ({
  field: { label, meta_key },
  row_index,
  property_key,
  values,
  isChild,
  onChange,
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
  }, [property_key, row_index, meta_key, onChange, dispatch]);

  const key = meta_key + row_index + property_key;

  return (
    <TextControl
      key={key}
      value={value}
      style={{ margin: 0 }}
      label={`Set ${(property_key || '').replace('_', ' ') || label}`}
      onChange={onChangeHandler}
    />
  );
};

export default TextField;
