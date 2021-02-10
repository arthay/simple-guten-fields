const { withSelect, select, withDispatch, useSelect } = wp.data;
const { TextareaControl } = wp.components;

const ControlField = withSelect((
  select,
  { field: { label, meta_key }, row_index, property_key, isChild, values }
) => {
  const value = isChild
    ? values
    : select('core/editor').getEditedPostAttribute('meta')[meta_key];

  const key = meta_key + row_index + property_key;
  const rows = 20;

  return {
    value,
    key,
    rows,
    label: `Set ${(property_key || '').replace('_', ' ') || label}`
  };
})(TextareaControl);

export default withDispatch((
  dispatch,
  { field: { meta_key }, row_index, property_key, onChange }
) => (
  {
    onChange: (value) => {
      if (onChange) {
        onChange(value, property_key, row_index);

        return;
      }

      dispatch('core/editor').editPost({ meta: { [meta_key]: value } });
    }
  }
))(ControlField);
