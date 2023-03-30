// GENERATED 
/**
 * A clickable tag component with an optional "close" icon
 *
 * @param label The text to display within the chip
 * @param onClick The click handler callback function
 * @param noEvents A flag indicating whether the chip cannot be clicked
 */
export const Chip = ({
  label,
  onClick,
  noEvents,
}: {
  label: string;
  onClick?: () => void;
  noEvents?: boolean;
}): JSX.Element => {
  return (
    <div
      className={`${css.chip} ${noEvents && css['no-events']}`}
      onClick={onClick}
    >
      {label}
      {!noEvents && <Icon name="close" />}
    </div>
  );
};

/** CSS Module classes */
const css = {
  chip: "chip-class-name",
  "no-events": "no-events-class-name"
}; 

/** 
 * SVG icon component, imported from elsewhere 
 * @param name The name of the icon to display
 */
declare const Icon: ({ name: string }) => JSX.Element;