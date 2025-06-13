export type FormControlType =
	| 'TEXTBOX'
	| 'TEXTAREA'
	| 'CHECKBOX'
	| 'RADIOBUTTONLIST'
	| 'CHECKBOXLIST'
	| 'DROPDOWNLIST'
	| 'DATE';

export type FormControlRow = {
	id: number;
	title: string;
	type: FormControlType;
	placeholder?: string;
	defaultChecked?: boolean;
	options?: string;
	minDate?: string;
	maxDate?: string;
	required: boolean;
};

export type EditLevel = 'none' | 'basic' | 'all';

export const typeDisplayNames = {
	TEXTBOX: 'Textbox',
	TEXTAREA: 'Textarea',
	CHECKBOX: 'Checkbox',
	RADIOBUTTONLIST: 'Radio button list',
	CHECKBOXLIST: 'Checkbox list',
	DROPDOWNLIST: 'Dropdown list',
	DATE: 'Date picker'
} as const;

export interface RowComponentProps {
	row: FormControlRow;
	isChecked: boolean;
	editLevel: EditLevel;
	onToggleCheck: (checked: boolean) => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onToggleEdit: () => void;
	onDelete: () => void;
}

export type ViewType = 'table' | 'card';

export interface Form {
	id: number;
	title: string;
	online: boolean;
	rows: FormControlRow[];
}
