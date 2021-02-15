import InnerControlComponent from "../InnerControlComponent";

const { useState, useMemo, useRef, useEffect } = wp.element;

const RepeaterItem = ({
  index,
  property_key,
  meta_key,
  controlsIndex,
  label,
  properties,
  propertiesKeys,
  values,
  onChange,
  control,
  title,
  removeItem
}) => {
  const contentRef = useRef(null);

  const [isRepeaterOpen, setIsRepeaterOpen] = useState(true);
  // const [contentHeight, setContentHeight] = useState(0);

  const repeaterItemTitle = useMemo(
    () => `${title ? `${title} -> ` : ''}Repeater Record ${index + 1}`, [title, index]
  );

  // useEffect(() => {
  //   if (contentRef.current) {
  //     setContentHeight(isRepeaterOpen ? contentRef.current.scrollHeight : 0);
  //   }
  //
  // }, [isRepeaterOpen, values]);
  //
  // const onChangeHandler = (value, foo, bar) => {
  //   setContentHeight(contentRef.current.scrollHeight);
  //   onChange(value, foo, bar);
  // }
  return (
    <div style={{
      border: '1px solid hsl(0, 0%, 80%)',
      padding: '10px 5px',
    }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <div><b>{repeaterItemTitle}:</b></div>
        <div
          onClick={() => setIsRepeaterOpen(value => !value)}
          style={{
            transition: "transform 0.2s",
            transform: isRepeaterOpen ? '' : 'rotate(180deg)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
               className="components-panel__arrow" role="img" aria-hidden="true" focusable="false">
            <path d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"></path>
          </svg>
        </div>
      </div>
      <div
        ref={contentRef}
        style={{
          transition: "max-height 0.5s",
          overflow: "hidden",
          height: isRepeaterOpen ? 'auto' : 0,
        }}
      >
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
              title={repeaterItemTitle}
              control_index={controlsIndex}
              onChange={onChange}
            />
          );
        })}
      </div>
      {
        index > 0
        && <button onClick={() => removeItem(index)}
        >
          Remove line {index + 1}
        </button>
      }
      <hr/>
    </div>
  )
}

export default RepeaterItem;

