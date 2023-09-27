import { IGridviewPanelProps } from "dockview";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const ANIMATION_DURATION = 1;

const FileDrawer = (props: IGridviewPanelProps<{ title: string }>) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [targetWidth, setTargetWidth] = useState(0);

  useHotkeys(
    'ctrl+b',
    () => {
      if (currentWidth > 0) {
        close();
      } else {
        open();
      }
    }
  );

  const animateSize = (initialWidth: number, targetWidth: number) => {
    let startTimestamp: number | null = null;

    const frame = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      const currentWidth = initialWidth + (targetWidth - initialWidth) * progress;
      props.api.setSize({ width: currentWidth });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setIsAnimating(false);
      }
    };

    setIsAnimating(true);
    requestAnimationFrame(frame);
  };

  const open = () => {
    if (!isAnimating) {
      animateSize(0, targetWidth);
    }
  };

  const close = () => {
    if (!isAnimating) {
      setTargetWidth(currentWidth);
      animateSize(currentWidth, 0);
    }
  };

  // useEffect is now used only if you need an initial animation or similar effect
  useEffect(() => {
    // Example: animate the opening when the component mounts
    const dispose = props.api.onDidDimensionsChange(event => {
      setCurrentWidth(event.width);
    })

    props.api.setSize({ width: 200 });

    return () => {
      dispose.dispose()
    }
  }, [props.api]);

  return (
    <div style={{ padding: '20px' }}>
      {props.params.title}
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  );
}

export default FileDrawer