import { Spell } from '@thothai/thoth-core/types';
import { CSSProperties } from 'react';
declare type ProjectProps = {
    label: string;
    selectedSpell?: Spell;
    icon?: string;
    onClick: Function;
    spell?: Spell;
    style?: CSSProperties;
    onDelete?: Function;
};
declare const ProjectRow: ({ label, selectedSpell, onClick, icon, spell, style, onDelete, }: ProjectProps) => JSX.Element;
export default ProjectRow;
