const { withSelect, withDispatch, select } = wp.data;
const { ColorPicker } = wp.components;
import { withState } from '@wordpress/compose';

const ColorPickerComponent = ({
  field: { label, meta_key },
  isChild,
  row_index,
  property_key,
  values,
  onChange,
}) => {
  let FieldControl = withState({
    showPicker: false,
  })(({ showPicker, setState, handleValueChange }) => {
    const color = isChild
      ? values
      : select('core/editor').getEditedPostAttribute('meta')?.[meta_key];

    return (
      <div style={{ margin: '20px' }}>
        <div
          onClick={() => setState({ showPicker: !showPicker })}
          style={{ display: 'flex' }}
        >
          <button>Pick Color for {label}</button>
          <div style={{ height: '22px', width: '200px', backgroundColor: color }}/>
        </div>
        {
          showPicker &&
          <ColorPicker
            color={color}
            onChangeComplete={handleValueChange}
          />
        }
        <button onClick={() => handleValueChange({ hex: '' })}>Remove Color</button>
      </div>
    );
  });

  FieldControl =  withDispatch((dispatch) => ({
    handleValueChange: (value) => {
      if (onChange) {
        onChange(value.hex, property_key, row_index);

        return;
      }

      dispatch('core/editor').editPost({ meta: { [meta_key]: value.hex } });
    }
  }))(FieldControl);

  return (
    <FieldControl />
  )
};
export default ColorPickerComponent;
