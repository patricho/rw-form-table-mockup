<script lang="ts">
	import type { FormControlType, FormControlRow } from '$lib/types.js';
	import { typeDisplayNames } from '$lib/types.js';

	interface Props {
		newRow: {
			title: string;
			type: FormControlType;
			placeholder: string;
			defaultChecked: boolean;
			options: string;
			minDate: string;
			maxDate: string;
			required: boolean;
		};
		onAdd: () => void;
		onCancel: () => void;
	}

	let { newRow, onAdd, onCancel }: Props = $props();

	let titleInput: HTMLInputElement;
</script>

<div class="bg-base-200 mt-8 rounded-lg p-6">
	<div class="flex gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">New field title</legend>
			<input
				bind:this={titleInput}
				type="text"
				class="input"
				bind:value={newRow.title}
				placeholder="Enter field title"
				onkeydown={(e) => e.key === 'Enter' && onAdd()}
			/>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Field type</legend>
			<select class="select" bind:value={newRow.type}>
				<option value="TEXTBOX">{typeDisplayNames.TEXTBOX}</option>
				<option value="TEXTAREA">{typeDisplayNames.TEXTAREA}</option>
				<option value="CHECKBOX">{typeDisplayNames.CHECKBOX}</option>
				<option value="RADIOBUTTONLIST">{typeDisplayNames.RADIOBUTTONLIST}</option>
				<option value="CHECKBOXLIST">{typeDisplayNames.CHECKBOXLIST}</option>
				<option value="DROPDOWNLIST">{typeDisplayNames.DROPDOWNLIST}</option>
				<option value="DATE">{typeDisplayNames.DATE}</option>
			</select>
		</fieldset>

		{#if newRow.type === 'TEXTBOX' || newRow.type === 'TEXTAREA'}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Placeholder text</legend>
				<input
					type="text"
					class="input"
					bind:value={newRow.placeholder}
					placeholder="Enter placeholder text"
				/>
			</fieldset>
		{/if}

		{#if newRow.type === 'CHECKBOX'}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Checked by default</legend>
				<input type="checkbox" class="toggle" bind:checked={newRow.defaultChecked} />
			</fieldset>
		{/if}

		{#if newRow.type === 'RADIOBUTTONLIST' || newRow.type === 'CHECKBOXLIST' || newRow.type === 'DROPDOWNLIST'}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Options (one per line)</legend>
				<textarea
					class="textarea"
					bind:value={newRow.options}
					placeholder="Option 1&#10;Option 2&#10;Option 3"
					rows="3"
				></textarea>
			</fieldset>
		{/if}

		{#if newRow.type === 'DATE'}
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Minimum date</legend>
				<input type="date" class="input" bind:value={newRow.minDate} />
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Maximum date</legend>
				<input type="date" class="input" bind:value={newRow.maxDate} />
			</fieldset>
		{/if}

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Required</legend>
			<input type="checkbox" class="toggle" bind:checked={newRow.required} />
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">&nbsp;</legend>
			<button class="btn btn-primary" onclick={onAdd} disabled={!newRow.title.trim()}>
				Add Field
			</button>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">&nbsp;</legend>
			<button class="btn" onclick={onCancel}> Cancel </button>
		</fieldset>
	</div>
</div>
