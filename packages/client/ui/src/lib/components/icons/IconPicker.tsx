import Image from "next/legacy/image";
import React, { useState } from 'react';

const icons = [
  'Ai',
  'AirElement',
  'Aquarius',
  'WizardHatOne',
  'WizardHatThree',
  'WizardHatTwo',
];

export const IconPicker: React.FC<{ onIconSelect: (icon: string) => void }> = ({
  onIconSelect,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-8 gap-4">
      {icons.map((icon) => (
        <div
          key={icon}
          onClick={() => {
            setSelectedIcon(icon);
            onIconSelect(icon);
          }}
          className={`cursor-pointer p-2 ${
            selectedIcon === icon ? 'ring-2 ring-secondary-highlight' : ''
          }`}
        >
          <Image
            src={`/icons/${icon}.svg`}
            alt={icon}
            className="object-contain w-8 h-8 mx-auto"
            width={32}
            height={32}
          />
        </div>
      ))}
    </div>
  );
};

