import controlsIndex from "./controlsIndex";

const InnerControlComponent = ({
  key,
  field,
  row_index,
  property_key,
  repeater_record_label,
  values,
  title,
  onChange,
}) => {
  const controlFieldKey = field.control ?? 'text';
  const ControlField = controlsIndex[controlFieldKey];

  return (
    <ControlField
      key={key}
      field={field}
      row_index={row_index}
      property_key={property_key}
      repeater_record_label={repeater_record_label}
      label={field.label}
      values={values[row_index][property_key]}
      onChange={(newValues) => onChange(newValues, property_key, row_index)}
      isChild={true}
      title={title}
    />
  );
};

export default InnerControlComponent;
