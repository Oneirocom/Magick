import React from 'react';
import {
  CSSProperties,
  HTMLProps,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

export type AutoSizeInputProps = HTMLProps<HTMLInputElement> & {
  minWidth?: number;
};

const baseStyles: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  height: 0,
  width: 'auto',
  whiteSpace: 'pre'
};

export const AutoSizeInput: React.FC<AutoSizeInputProps> = ({
  minWidth = 30,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [styles, setStyles] = useState<CSSProperties>({});

  // grab the font size of the input on ref mount
  const setRef = useCallback((input: HTMLInputElement | null) => {
    if (input) {
      const styles = window.getComputedStyle(input);
      setStyles({
        fontSize: styles.getPropertyValue('font-size'),
        paddingLeft: styles.getPropertyValue('padding-left'),
        paddingRight: styles.getPropertyValue('padding-right')
      });
    }
    inputRef.current = input;
  }, []);

  // measure the text on change and update input
  useEffect(() => {
    if (measureRef.current === null) return;
    if (inputRef.current === null) return;

    const padding = props.type === 'number' || props.type === 'float' ? 20 : 0;

    const width = measureRef.current.clientWidth + padding;
    inputRef.current.style.width = Math.max(minWidth, width) + 'px';
  }, [props.value, minWidth, styles, props.type]);

  return (
    <>
      <input ref={setRef} {...props} />
      <span ref={measureRef} style={{ ...baseStyles, ...styles }}>
        {props.value}
      </span>
    </>
  );
};
