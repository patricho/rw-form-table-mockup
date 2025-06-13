<script lang="ts">
	import SvgIcon from '@jamescoyle/svelte-icon';
	import {
		mdiSquareRoundedOutline,
		mdiTrashCan,
		mdiAsterisk,
		mdiCircleOutline
	} from '@mdi/js';

	interface Props {
		checkedCount: number;
		onSelectNone: () => void;
		onSetRequired: (required: boolean) => void;
		onDeleteSelected: () => void;
	}

	let { checkedCount, onSelectNone, onSetRequired, onDeleteSelected }: Props = $props();
</script>

{#if checkedCount > 0}
	<div class="bg-base-200 mt-4 flex items-center justify-between rounded-lg p-4">
		<span class="text-sm">
			{checkedCount} row{checkedCount === 1 ? '' : 's'} selected
		</span>
		<span class="flex gap-2">
			<button class="btn btn-sm" onclick={onSelectNone}>
				<SvgIcon type="mdi" path={mdiSquareRoundedOutline} size="16"></SvgIcon>
				Deselect all
			</button>
			<button class="btn btn-sm" onclick={() => onSetRequired(true)}>
				<SvgIcon type="mdi" path={mdiAsterisk} size="16"></SvgIcon>
				Required
			</button>
			<button class="btn btn-sm" onclick={() => onSetRequired(false)}>
				<SvgIcon type="mdi" path={mdiCircleOutline} size="16"></SvgIcon>
				Optional
			</button>
			<button class="btn btn-error btn-sm" onclick={onDeleteSelected}>
				<SvgIcon type="mdi" path={mdiTrashCan} size="16"></SvgIcon>
				Delete selected
			</button>
		</span>
	</div>
{/if}