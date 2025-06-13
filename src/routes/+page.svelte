<script lang="ts">
	import type { Form, FormControlRow, FormControlType, EditLevel, ViewType } from '$lib/types.js';
	import { typeDisplayNames } from '$lib/types.js';
	import FormSection from '$lib/components/FormSection.svelte';

	let forms = $state([
		{
			id: 1,
			title: 'Form 1: Grant Application Form',
			online: true,
			rows: [
				{
					id: 1,
					title: 'Organization Name',
					type: 'TEXTBOX',
					placeholder: 'Enter your organization name',
					required: true
				},
				{
					id: 2,
					title: 'Project Title',
					type: 'TEXTBOX',
					placeholder: 'Enter project title',
					required: true
				},
				{
					id: 3,
					title: 'Project Description',
					type: 'TEXTAREA',
					placeholder: 'Describe your project...',
					required: true
				},
				{
					id: 4,
					title: 'Requested Amount',
					type: 'TEXTBOX',
					placeholder: '$0.00',
					required: true
				},
				{
					id: 5,
					title: 'Tax-Exempt Status',
					type: 'CHECKBOX',
					defaultChecked: false,
					required: false
				}
			]
		},
		{
			id: 2,
			title: 'Form 2: Contact Information',
			online: false,
			rows: [
				{
					id: 6,
					title: 'Principal Investigator Name',
					type: 'TEXTBOX',
					placeholder: 'Full name',
					required: true
				},
				{
					id: 9,
					title: 'Contact Email',
					type: 'TEXTBOX',
					placeholder: 'email@example.com',
					required: true
				},
				{
					id: 10,
					title: 'Organization Type',
					type: 'RADIOBUTTONLIST',
					options: 'Non-profit\nFor-profit\nGovernment\nAcademic Institution',
					required: true
				}
			]
		},
		{
			id: 3,
			title: 'Form 3: Project Details',
			online: true,
			rows: [
				{
					id: 7,
					title: 'Budget Justification',
					type: 'TEXTAREA',
					placeholder: 'Explain your budget breakdown...',
					required: true
				},
				{
					id: 8,
					title: 'Previous Grant Recipient',
					type: 'CHECKBOX',
					defaultChecked: false,
					required: false
				},
				{
					id: 11,
					title: 'Project Duration',
					type: 'RADIOBUTTONLIST',
					options: '6 months\n12 months\n18 months\n24 months',
					required: true
				},
				{
					id: 12,
					title: 'Additional Comments',
					type: 'TEXTAREA',
					placeholder: 'Any additional information...',
					required: false
				}
			]
		}
	] as Form[]);

	let masterEditLevel = $state<EditLevel>('none');
	let rowEditLevels = $state(new Map<number, EditLevel>());
	let viewType = $state<ViewType>('table');
	let searchText = $state('');
	let selectedTypes = $state(
		new Set<FormControlType>([
			'TEXTBOX',
			'TEXTAREA',
			'CHECKBOX',
			'RADIOBUTTONLIST',
			'CHECKBOXLIST',
			'DROPDOWNLIST',
			'DATE'
		])
	);
	let showNewFieldSection = $state(false);

	let allRows = $derived(forms.flatMap((form) => form.rows));
	let totalRowCount = $derived(allRows.length);
	let filteredRowCount = $derived(
		forms.reduce((total, form) => {
			const formFilteredRows = form.rows.filter((row) => {
				const matchesSearch = row.title.toLowerCase().includes(searchText.toLowerCase());
				const matchesType = selectedTypes.has(row.type);
				return matchesSearch && matchesType;
			});
			return total + formFilteredRows.length;
		}, 0)
	);

	function toggleControlType(type: FormControlType) {
		if (selectedTypes.has(type)) {
			selectedTypes.delete(type);
		} else {
			selectedTypes.add(type);
		}
		selectedTypes = new Set(selectedTypes);
	}

	function selectAllTypes() {
		selectedTypes = new Set([
			'TEXTBOX',
			'TEXTAREA',
			'CHECKBOX',
			'RADIOBUTTONLIST',
			'CHECKBOXLIST',
			'DROPDOWNLIST',
			'DATE'
		]);
	}

	function selectNoTypes() {
		selectedTypes = new Set();
	}

	function setAllEditLevel(level: EditLevel) {
		masterEditLevel = level;
		for (const form of forms) {
			for (const row of form.rows) {
				rowEditLevels.set(row.id, level);
			}
		}
		rowEditLevels = new Map(rowEditLevels);
	}

	function updateForm(updatedForm: Form) {
		forms = forms.map((form) => (form.id === updatedForm.id ? updatedForm : form));
	}

	function updateRowEditLevels(levels: Map<number, EditLevel>) {
		rowEditLevels = levels;
	}
</script>

<div class="p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-lg">RW Forms Mockup</h1>
		<div class="text-base-content/70 text-sm">
			Showing {filteredRowCount} of {totalRowCount} rows
		</div>
	</div>

	<!-- Filters Section -->
	<div class="bg-base-200 my-4 rounded-lg p-4">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
			<!-- Search -->
			<div>
				<label class="label label-text-alt">Search by title</label>
				<input
					type="text"
					class="input input-sm w-full"
					placeholder="Search rows..."
					bind:value={searchText}
				/>
			</div>

			<!-- View Type and New Field Toggle -->
			<div>
				<label class="label label-text-alt">View options</label>
				<div class="space-y-3">
					<div class="flex gap-2">
						<label class="label cursor-pointer gap-1">
							<input
								type="radio"
								name="viewType"
								class="radio radio-sm"
								value="table"
								checked={viewType === 'table'}
								onchange={() => (viewType = 'table')}
							/>
							<span class="label-text text-sm">Table</span>
						</label>
						<label class="label cursor-pointer gap-1">
							<input
								type="radio"
								name="viewType"
								class="radio radio-sm"
								value="card"
								checked={viewType === 'card'}
								onchange={() => (viewType = 'card')}
							/>
							<span class="label-text text-sm">Card</span>
						</label>
					</div>
					<label class="label cursor-pointer justify-start gap-1">
						<input
							type="checkbox"
							class="checkbox checkbox-sm"
							bind:checked={showNewFieldSection}
						/>
						<span class="label-text text-sm">Show new field section</span>
					</label>
				</div>
			</div>

			<!-- Expanded Controls -->
			<div>
				<label class="label label-text-alt">Expanded controls</label>
				<div class="flex gap-1">
					<label class="label cursor-pointer gap-1">
						<input
							type="radio"
							name="masterEdit"
							class="radio radio-xs"
							value="none"
							checked={masterEditLevel === 'none'}
							onchange={() => setAllEditLevel('none')}
						/>
						<span class="label-text text-xs">None</span>
					</label>
					<label class="label cursor-pointer gap-1">
						<input
							type="radio"
							name="masterEdit"
							class="radio radio-xs"
							value="basic"
							checked={masterEditLevel === 'basic'}
							onchange={() => setAllEditLevel('basic')}
						/>
						<span class="label-text text-xs">Basic</span>
					</label>
					<label class="label cursor-pointer gap-1">
						<input
							type="radio"
							name="masterEdit"
							class="radio radio-xs"
							value="all"
							checked={masterEditLevel === 'all'}
							onchange={() => setAllEditLevel('all')}
						/>
						<span class="label-text text-xs">All</span>
					</label>
				</div>
			</div>

			<!-- Control Types Filter -->
			<div>
				<div class="mb-2 flex items-center justify-between">
					<label class="label label-text-alt">Show control types</label>
					<div class="flex gap-1">
						<button class="btn btn-xs" onclick={selectAllTypes}>All</button>
						<button class="btn btn-xs" onclick={selectNoTypes}>None</button>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-1 text-xs">
					{#each Object.entries(typeDisplayNames) as [type, displayName]}
						<label class="label cursor-pointer justify-start gap-1">
							<input
								type="checkbox"
								class="checkbox checkbox-xs"
								checked={selectedTypes.has(type as FormControlType)}
								onchange={() => toggleControlType(type as FormControlType)}
							/>
							<span class="label-text text-xs">{displayName}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Forms -->
	{#each forms as form}
		{@const filteredRows = form.rows.filter((row) => {
			const matchesSearch = row.title.toLowerCase().includes(searchText.toLowerCase());
			const matchesType = selectedTypes.has(row.type);
			return matchesSearch && matchesType;
		})}

		<FormSection
			{form}
			{viewType}
			{masterEditLevel}
			{rowEditLevels}
			{filteredRows}
			{showNewFieldSection}
			onUpdateForm={updateForm}
			onUpdateRowEditLevels={updateRowEditLevels}
		/>
	{/each}
</div>
