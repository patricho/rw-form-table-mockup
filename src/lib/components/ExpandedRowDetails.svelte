<script lang="ts">
	import type { FormControlRow, EditLevel } from '$lib/types.js';
	import AllExpandedRowDetails from './AllExpandedRowDetails.svelte';

	interface Props {
		row: FormControlRow;
		editLevel: EditLevel;
	}

	let { row, editLevel }: Props = $props();
</script>

{#if editLevel !== 'none'}
	<tr>
		<td></td>
		<td colspan="5">
			<div class="flex gap-8">
				{#if row.type === 'TEXTBOX' || row.type === 'TEXTAREA'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend p-0">Placeholder text</legend>
						<input type="text" class="input w-90" bind:value={row.placeholder} />
					</fieldset>
				{/if}

				{#if row.type === 'CHECKBOX'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend p-0">Checked by default</legend>
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox checkbox-sm"
								bind:checked={row.defaultChecked}
							/>
						</label>
					</fieldset>
				{/if}

				{#if row.type === 'RADIOBUTTONLIST' || row.type === 'CHECKBOXLIST' || row.type === 'DROPDOWNLIST'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend p-0">Options (one per line)</legend>
						<textarea
							class="textarea w-90"
							bind:value={row.options}
							placeholder="Option 1&#10;Option 2&#10;Option 3"
							rows="4"
						></textarea>
					</fieldset>
				{/if}

				{#if row.type === 'DATE'}
					<fieldset class="fieldset">
						<legend class="fieldset-legend p-0">Minimum date (optional)</legend>
						<input type="date" class="input w-40" bind:value={row.minDate} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend p-0">Maximum date (optional)</legend>
						<input type="date" class="input w-40" bind:value={row.maxDate} />
					</fieldset>
				{/if}
			</div>
			{#if editLevel === 'all'}
				<AllExpandedRowDetails />
			{/if}
		</td>
	</tr>
{/if}
