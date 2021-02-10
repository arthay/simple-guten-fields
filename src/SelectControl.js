const { withSelect, withDispatch, select } = wp.data;
const { SelectControl } = wp.components;


const SelectControlField = withSelect((
  select,
  { field: { meta_key, options, label }, property_key, values, isChild }
) => {
  const value = isChild
    ? values
    : select('core/editor').getEditedPostAttribute('meta')[meta_key];

  return {
    label: `Set ${(property_key || '').replace('_', ' ') || label}`,
    options: options,
    value,
  };
})(SelectControl);

export default withDispatch((
  dispatch,
  { field: { meta_key }, row_index, property_key, onChange }
) => ({
  onChange: (value) => {
    if (onChange) {
      onChange(value, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: value } });
  }
}))(SelectControlField);
