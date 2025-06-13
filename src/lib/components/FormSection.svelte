<script lang="ts">
	import type { Form, FormControlRow, FormControlType, EditLevel, ViewType } from '$lib/types.js';
	import AddNewRowSection from './AddNewRowSection.svelte';
	import SelectedRowsActions from './SelectedRowsActions.svelte';
	import TableRow from './TableRow.svelte';
	import CardRow from './CardRow.svelte';

	interface Props {
		form: Form;
		viewType: ViewType;
		masterEditLevel: EditLevel;
		rowEditLevels: Map<number, EditLevel>;
		filteredRows: FormControlRow[];
		showNewFieldSection: boolean;
		onUpdateForm: (updatedForm: Form) => void;
		onUpdateRowEditLevels: (levels: Map<number, EditLevel>) => void;
	}

	let {
		form,
		viewType,
		masterEditLevel,
		rowEditLevels,
		filteredRows,
		showNewFieldSection,
		onUpdateForm,
		onUpdateRowEditLevels
	}: Props = $props();

	let checked = $state([] as number[]);
	let newRow = $state({
		title: '',
		type: 'TEXTBOX' as FormControlType,
		placeholder: '',
		defaultChecked: false,
		options: '',
		minDate: '',
		maxDate: '',
		required: false
	});

	let allChecked = $derived(checked.length === filteredRows.length && filteredRows.length > 0);
	let someChecked = $derived(checked.length > 0 && checked.length < filteredRows.length);

	function toggleAll() {
		if (allChecked) {
			checked.length = 0;
		} else {
			checked = filteredRows.map((row) => row.id);
		}
	}

	function selectNone() {
		checked.length = 0;
	}

	function deleteSelected() {
		const updatedForm = {
			...form,
			rows: form.rows.filter((row) => !checked.includes(row.id))
		};
		onUpdateForm(updatedForm);
		checked.length = 0;
	}

	function moveUp(id: number) {
		const index = form.rows.findIndex((row) => row.id === id);
		if (index > 0) {
			const newRows = [...form.rows];
			[newRows[index - 1], newRows[index]] = [newRows[index], newRows[index - 1]];
			onUpdateForm({ ...form, rows: newRows });
		}
	}

	function moveDown(id: number) {
		const index = form.rows.findIndex((row) => row.id === id);
		if (index < form.rows.length - 1) {
			const newRows = [...form.rows];
			[newRows[index], newRows[index + 1]] = [newRows[index + 1], newRows[index]];
			onUpdateForm({ ...form, rows: newRows });
		}
	}

	function toggleEdit(id: number) {
		const currentLevel = rowEditLevels.get(id) || 'none';
		let nextLevel: EditLevel;

		if (currentLevel === 'none') {
			nextLevel = 'basic';
		} else if (currentLevel === 'basic') {
			nextLevel = 'all';
		} else {
			nextLevel = 'none';
		}

		const newLevels = new Map(rowEditLevels);
		newLevels.set(id, nextLevel);
		onUpdateRowEditLevels(newLevels);
	}

	function getEffectiveEditLevel(id: number): EditLevel {
		return rowEditLevels.get(id) || masterEditLevel;
	}

	function setSelectedRequired(required: boolean) {
		const updatedForm = {
			...form,
			rows: form.rows.map((row) => (checked.includes(row.id) ? { ...row, required } : row))
		};
		onUpdateForm(updatedForm);
		selectNone();
	}

	function deleteRow(id: number) {
		const updatedForm = {
			...form,
			rows: form.rows.filter((row) => row.id !== id)
		};
		onUpdateForm(updatedForm);
		checked = checked.filter((checkedId) => checkedId !== id);
		const newLevels = new Map(rowEditLevels);
		newLevels.delete(id);
		onUpdateRowEditLevels(newLevels);
	}

	function addRow() {
		if (!newRow.title.trim()) return;

		const allRows = form.rows;
		const nextId = allRows.length > 0 ? Math.max(...allRows.map((r) => r.id)) + 1 : 1;
		const rowToAdd: FormControlRow = {
			id: nextId,
			title: newRow.title,
			type: newRow.type,
			required: newRow.required
		};

		if (newRow.type === 'TEXTBOX' || newRow.type === 'TEXTAREA') {
			rowToAdd.placeholder = newRow.placeholder;
		} else if (newRow.type === 'CHECKBOX') {
			rowToAdd.defaultChecked = newRow.defaultChecked;
		} else if (
			newRow.type === 'RADIOBUTTONLIST' ||
			newRow.type === 'CHECKBOXLIST' ||
			newRow.type === 'DROPDOWNLIST'
		) {
			rowToAdd.options = newRow.options;
		} else if (newRow.type === 'DATE') {
			rowToAdd.minDate = newRow.minDate;
			rowToAdd.maxDate = newRow.maxDate;
		}

		const updatedForm = {
			...form,
			rows: [...form.rows, rowToAdd]
		};
		onUpdateForm(updatedForm);

		// Reset form
		newRow.title = '';
		newRow.placeholder = '';
		newRow.defaultChecked = false;
		newRow.options = '';
		newRow.minDate = '';
		newRow.maxDate = '';
		newRow.required = false;
	}

	function cancelAddRow() {
		newRow.title = '';
		newRow.type = 'TEXTBOX';
		newRow.placeholder = '';
		newRow.defaultChecked = false;
		newRow.options = '';
		newRow.minDate = '';
		newRow.maxDate = '';
		newRow.required = false;
	}
</script>

<div class="bg-base-200 border-base-200 collapse-arrow collapse mb-4 border">
	<input type="checkbox" checked />
	<h1 class="collapse-title text-xl font-semibold">
		<span class={'status status-md ' + (form.online ? 'status-success' : 'status-error')}></span>

		{form.title}
	</h1>
	<div class="collapse-content">
		{#if viewType === 'table'}
			<div class="overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr>
							<th>
								<input
									type="checkbox"
									class="checkbox"
									checked={allChecked}
									indeterminate={someChecked}
									onchange={toggleAll}
								/>
							</th>
							<th>Title</th>
							<th>Type</th>
							<th>Required</th>
							<th> </th>
						</tr>
					</thead>
					<tbody>
						{#each filteredRows as row}
							<TableRow
								{row}
								isChecked={checked.includes(row.id)}
								editLevel={getEffectiveEditLevel(row.id)}
								onToggleCheck={(isChecked) => {
									if (isChecked) {
										checked.push(row.id);
									} else {
										checked = checked.filter((id) => id !== row.id);
									}
								}}
								onMoveUp={() => moveUp(row.id)}
								onMoveDown={() => moveDown(row.id)}
								onToggleEdit={() => toggleEdit(row.id)}
								onDelete={() => deleteRow(row.id)}
							/>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<!-- Card View -->
			<div class="mb-4 flex items-center gap-4">
				<label class="label cursor-pointer gap-2">
					<input
						type="checkbox"
						class="checkbox"
						checked={allChecked}
						indeterminate={someChecked}
						onchange={toggleAll}
					/>
					<span class="label-text">Select all</span>
				</label>
			</div>

			<div class="space-y-4">
				{#each filteredRows as row}
					<CardRow
						{row}
						isChecked={checked.includes(row.id)}
						editLevel={getEffectiveEditLevel(row.id)}
						onToggleCheck={(isChecked) => {
							if (isChecked) {
								checked.push(row.id);
							} else {
								checked = checked.filter((id) => id !== row.id);
							}
						}}
						onMoveUp={() => moveUp(row.id)}
						onMoveDown={() => moveDown(row.id)}
						onToggleEdit={() => toggleEdit(row.id)}
						onDelete={() => deleteRow(row.id)}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<SelectedRowsActions
		checkedCount={checked.length}
		onSelectNone={selectNone}
		onSetRequired={setSelectedRequired}
		onDeleteSelected={deleteSelected}
	/>

	{#if showNewFieldSection}
		<AddNewRowSection {newRow} onAdd={addRow} onCancel={cancelAddRow} />
	{/if}
</div>
