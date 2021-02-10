const { withSelect, withDispatch, select } = wp.data;
const { SelectControl } = wp.components;


const ControlField = withSelect((
  select,
  { field: { meta_key, options, label }, row_index, values }
) => {
  const value = row_index !== undefined
    ? values
    : select('core/editor').getEditedPostAttribute('meta')[meta_key];

  return {
    label: `Set ${label}`,
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
}))(ControlField);
