<script lang="ts">
	import SvgIcon from '@jamescoyle/svelte-icon';
	import {
		mdiArrowUp,
		mdiArrowDown,
		mdiTrashCan,
		mdiLeadPencil,
		mdiDotsHorizontal
	} from '@mdi/js';
	import type { RowComponentProps } from '$lib/types.js';
	import { typeDisplayNames } from '$lib/types.js';
	import ExpandedRowDetails from './ExpandedRowDetails.svelte';

	let { row, isChecked, editLevel, onToggleCheck, onMoveUp, onMoveDown, onToggleEdit, onDelete }: RowComponentProps = $props();
</script>

<tr>
	<td>
		<input
			type="checkbox"
			checked={isChecked}
			onclick={(e) => onToggleCheck((e.target as HTMLInputElement).checked)}
			class="checkbox"
		/>
	</td>
	<td>
		<input type="text" class="input w-100" bind:value={row.title} />
	</td>
	<td>
		<select class="select w-40" bind:value={row.type}>
			<option value="TEXTBOX">{typeDisplayNames.TEXTBOX}</option>
			<option value="TEXTAREA">{typeDisplayNames.TEXTAREA}</option>
			<option value="CHECKBOX">{typeDisplayNames.CHECKBOX}</option>
			<option value="RADIOBUTTONLIST">{typeDisplayNames.RADIOBUTTONLIST}</option>
			<option value="CHECKBOXLIST">{typeDisplayNames.CHECKBOXLIST}</option>
			<option value="DROPDOWNLIST">{typeDisplayNames.DROPDOWNLIST}</option>
			<option value="DATE">{typeDisplayNames.DATE}</option>
		</select>
	</td>
	<td>
		<input type="checkbox" class="checkbox checkbox-sm" bind:checked={row.required} />
	</td>
	<td>
		<div class="flex justify-end">
			<button class="btn btn-ghost btn-xs" onclick={onMoveUp}>
				<SvgIcon type="mdi" path={mdiArrowUp} size="20"></SvgIcon>
			</button>

			<button class="btn btn-ghost btn-xs" onclick={onMoveDown}>
				<SvgIcon type="mdi" path={mdiArrowDown}></SvgIcon>
			</button>

			<button class="btn btn-ghost btn-xs" onclick={onToggleEdit}>
				<SvgIcon type="mdi" path={mdiLeadPencil} size="20"></SvgIcon>
			</button>

			<button class="btn btn-ghost btn-xs" onclick={onDelete}>
				<SvgIcon type="mdi" path={mdiTrashCan} size="20"></SvgIcon>
			</button>

			<button
				class="btn btn-ghost btn-xs"
				popovertarget="popover-1"
				style="anchor-name:--anchor-1"
			>
				<SvgIcon type="mdi" path={mdiDotsHorizontal} size="20"></SvgIcon>
			</button>
			<ul
				class="dropdown dropdown-end menu rounded-box bg-base-100 w-52 shadow-sm"
				popover
				id="popover-1"
				style="position-anchor:--anchor-1"
			>
				<li><button>Additional actions</button></li>
				<li><button>Go in this menu</button></li>
			</ul>
		</div>
	</td>
</tr>
<ExpandedRowDetails {row} {editLevel} />