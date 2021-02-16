const {
  components: { ColorPicker },
  data: { dispatch, useSelect },
  element: { useState, useCallback }
} = wp;

const ColorPickerControlComponent = ({
  field: { label, meta_key },
  isChild,
  row_index,
  property_key,
  values,
  onChange,
}) => {
  const [ showPicker, setShowPicker ] = useState(false);
  const color = isChild
    ? values
    : useSelect(select => select('core/editor').getEditedPostAttribute('meta')[meta_key]);

  const onChangeHandler = useCallback((value) => {
    if (onChange) {
      onChange(value.hex, property_key, row_index);

      return;
    }

    dispatch('core/editor').editPost({ meta: { [meta_key]: value.hex } });
  }, [ onChange, property_key, row_index, meta_key, dispatch ]);

  return (
    <div style={{ margin: '20px' }}>
      <div
        onClick={() => setShowPicker(value => !value)}
        style={{ display: 'flex' }}
      >
        <button>Pick Color for {label}</button>
        <div style={{ height: '22px', width: '200px', backgroundColor: color }}/>
      </div>
      {
        showPicker &&
        <ColorPicker
          color={color}
          onChangeComplete={onChangeHandler}
        />
      }
      <button onClick={() => onChangeHandler({ hex: '' })}>Remove Color</button>
    </div>
  );
};

export default ColorPickerControlComponent;
