import InnerControlComponent from "./InnerControlComponent";

const { withDispatch, useSelect } = wp.data;
const { useMemo } = wp.element;

const ControlField = ({
  field: { meta_key, label, show_in_rest, control },
  controlsIndex,
  property_key,
  onChange,
  values,
  isChild = false,
}) => {
  const properties = show_in_rest?.schema?.items?.properties;

  const propertiesKeys = Object.entries(properties).map(item => item[0]);

  const wrapperStyles = useMemo(() => {
    if (isChild) {
      return {
        marginLeft: 5,
        marginTop: 10,
        border: '1px solid hsl(0, 0%, 80%)',
        padding: '10px 5px',
      }
    }

    return {}
  }, [isChild]);

  const addItem = () => {
    let newValues = [];
    if (values && values.length) {
      newValues = values.slice(0);
    }

    newValues.push({});

    onChange(newValues);
  };

  const removeItem = (index) => {
    if (confirm("Confirm delete")) {
      let newValues = values.slice(0);
      newValues = newValues.filter((obj, loopIndex) => loopIndex !== index);

      onChange(newValues);
    }
  };

  const onChangeHandler = (innerValues, inner_property_key, inner_row_index) => {
    let newValues = values.slice(0);

    newValues = newValues.map((row, index) => (
      index === inner_row_index ? { ...row, [inner_property_key]: innerValues } : row
    ));

    onChange(newValues);
  };

  return (
    <div style={wrapperStyles}>
      <h3>{`${label}`} (Repeater field):</h3>
      {Array.isArray(values) && values.map((row, index) => {
        return (
          <div key={`repeaterValues${index}${meta_key}`}>
            <div><b>Repeater Record {index + 1}:</b></div>
            {propertiesKeys.map((propertyKey) => {
              let innerField = properties[propertyKey];
              innerField.meta_key = meta_key;
              innerField.label = label;
              return (
                <InnerControlComponent
                  key={index + property_key}
                  field={innerField}
                  parent_control={control}
                  row_index={index}
                  property_key={propertyKey}
                  repeater_record_label={`${label} ${propertyKey}`}
                  values={values}
                  control_index={controlsIndex}
                  onChange={onChangeHandler}
                />
              );
            })}
            {
              index > 0
              && <button onClick={() => removeItem(index)}
              >
                Remove line {index + 1}
              </button>
            }
            <hr/>
          </div>
        );
      })}
      <button
        style={{ marginTop: '10px' }}
        onClick={addItem}
      >
        Add Item
      </button>
    </div>
  );
};

const RepeaterControl = ({
  field,
  controlsIndex,
  property_key,
  row_index,
  isChild = false,
  values,
  onChange,
  editPost
}) => {
  if(!isChild) {
    values = useSelect(
      select => select('core/editor').getEditedPostAttribute('meta')?.[field.meta_key]
    );
  }

  const onChangeHandler = (newValues) => {
    if(!onChange) {
      editPost(newValues);

      return;
    }

    onChange(newValues);
  };

  return (
    <ControlField
      values={values}
      field={field}
      controlsIndex={controlsIndex}
      property_key={property_key}
      row_index={row_index}
      isChild={isChild}
      onChange={onChangeHandler}
    />
  );
};

export default withDispatch((dispatch, { field: { meta_key } }) => ({
  editPost: (newValues) => {
    dispatch('core/editor').editPost({ meta: { [meta_key]: newValues } });
  }
}))(RepeaterControl);
