<script lang="ts">
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiArrowUp, mdiArrowDown, mdiTrashCan, mdiLeadPencil, mdiDotsHorizontal } from '@mdi/js';
	import type { RowComponentProps } from '$lib/types.js';
	import { typeDisplayNames } from '$lib/types.js';
	import ExpandedRowDetails from './ExpandedRowDetails.svelte';

	let {
		row,
		isChecked,
		editLevel,
		onToggleCheck,
		onMoveUp,
		onMoveDown,
		onToggleEdit,
		onDelete
	}: RowComponentProps = $props();
</script>

<div class="card bg-base-300 border-base-200 mb-4 border shadow-sm">
	<div class="card-body p-4">
		<div class="flex items-start gap-4">
			<input
				type="checkbox"
				checked={isChecked}
				onclick={(e) => onToggleCheck((e.target as HTMLInputElement).checked)}
				class="checkbox mt-1"
			/>

			<div class="flex-1 space-y-3">
				<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div>
						<label class="label label-text-alt">Field Title</label>
						<input type="text" class="input input-sm w-full" bind:value={row.title} />
					</div>

					<div>
						<label class="label label-text-alt">Field Type</label>
						<select class="select select-sm w-full" bind:value={row.type}>
							<option value="TEXTBOX">{typeDisplayNames.TEXTBOX}</option>
							<option value="TEXTAREA">{typeDisplayNames.TEXTAREA}</option>
							<option value="CHECKBOX">{typeDisplayNames.CHECKBOX}</option>
							<option value="RADIOBUTTONLIST">{typeDisplayNames.RADIOBUTTONLIST}</option>
							<option value="CHECKBOXLIST">{typeDisplayNames.CHECKBOXLIST}</option>
							<option value="DROPDOWNLIST">{typeDisplayNames.DROPDOWNLIST}</option>
							<option value="DATE">{typeDisplayNames.DATE}</option>
						</select>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div class="flex items-center gap-2">
						<label class="label label-text-alt">Required</label>
						<input type="checkbox" class="checkbox checkbox-sm" bind:checked={row.required} />
					</div>
				</div>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div class="card-actions">
						<div class="btn-group">
							<button class="btn btn-ghost btn-sm" onclick={onMoveUp} title="Move Up">
								<SvgIcon type="mdi" path={mdiArrowUp} size="16"></SvgIcon>
							</button>

							<button class="btn btn-ghost btn-sm" onclick={onMoveDown} title="Move Down">
								<SvgIcon type="mdi" path={mdiArrowDown} size="16"></SvgIcon>
							</button>

							<button class="btn btn-ghost btn-sm" onclick={onToggleEdit} title="Toggle Edit">
								<SvgIcon type="mdi" path={mdiLeadPencil} size="16"></SvgIcon>
							</button>

							<button class="btn btn-ghost btn-sm" onclick={onDelete} title="Delete">
								<SvgIcon type="mdi" path={mdiTrashCan} size="16"></SvgIcon>
							</button>

							<div class="dropdown dropdown-end">
								<button tabindex="0" class="btn btn-ghost btn-sm" title="More Actions">
									<SvgIcon type="mdi" path={mdiDotsHorizontal} size="16"></SvgIcon>
								</button>
								<ul
									tabindex="0"
									class="dropdown-content menu rounded-box bg-base-100 border-base-200 mt-1 w-52 border shadow-sm"
								>
									<li><button>Additional actions</button></li>
									<li><button>Go in this menu</button></li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{#if editLevel !== 'none'}
					<table>
						<ExpandedRowDetails {row} {editLevel} />
					</table>
				{/if}
			</div>
		</div>
	</div>
</div>
