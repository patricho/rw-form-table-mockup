<script lang="ts">
	import SvgIcon from '@jamescoyle/svelte-icon';
	import {
		mdiSquareRoundedOutline,
		mdiArrowUp,
		mdiArrowDown,
		mdiTrashCan,
		mdiLeadPencil,
		mdiDotsHorizontal,
		mdiAsterisk,
		mdiCircleOutline
	} from '@mdi/js';

	type FormControlType =
		| 'TEXTBOX'
		| 'TEXTAREA'
		| 'CHECKBOX'
		| 'RADIOBUTTONLIST'
		| 'CHECKBOXLIST'
		| 'DROPDOWNLIST'
		| 'DATE';

	type FormControlRow = {
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

	const typeDisplayNames = {
		TEXTBOX: 'Textbox',
		TEXTAREA: 'Textarea',
		CHECKBOX: 'Checkbox',
		RADIOBUTTONLIST: 'Radio button list',
		CHECKBOXLIST: 'Checkbox list',
		DROPDOWNLIST: 'Dropdown list',
		DATE: 'Date picker'
	} as const;

	let rows = $state([
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
		},
		{
			id: 6,
			title: 'Principal Investigator Name',
			type: 'TEXTBOX',
			placeholder: 'Full name',
			required: true
		},
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
	] as FormControlRow[]);

	type EditLevel = 'none' | 'basic' | 'all';

	let checked = $state([] as number[]);
	let masterEditLevel = $state<EditLevel>('none');
	let rowEditLevels = $state(new Map<number, EditLevel>());

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

	let titleInput: HTMLInputElement;

	let allChecked = $derived(checked.length === rows.length);
	let someChecked = $derived(checked.length > 0 && checked.length < rows.length);

	function toggleAll() {
		if (allChecked) {
			checked.length = 0;
		} else {
			checked = rows.map((row) => row.id);
		}
	}

	function selectNone() {
		checked.length = 0;
	}

	function deleteSelected() {
		rows = rows.filter((row) => !checked.includes(row.id));
		checked.length = 0;
	}

	function moveUp(id: number) {
		const index = rows.findIndex((row) => row.id === id);
		if (index > 0) {
			const newRows = [...rows];
			[newRows[index - 1], newRows[index]] = [newRows[index], newRows[index - 1]];
			rows = newRows;
		}
	}

	function moveDown(id: number) {
		const index = rows.findIndex((row) => row.id === id);
		if (index < rows.length - 1) {
			const newRows = [...rows];
			[newRows[index], newRows[index + 1]] = [newRows[index + 1], newRows[index]];
			rows = newRows;
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

		rowEditLevels.set(id, nextLevel);
		rowEditLevels = new Map(rowEditLevels);
	}

	function setAllEditLevel(level: EditLevel) {
		masterEditLevel = level;
		for (const row of rows) {
			rowEditLevels.set(row.id, level);
		}
		rowEditLevels = new Map(rowEditLevels);
	}

	function getEffectiveEditLevel(id: number): EditLevel {
		return rowEditLevels.get(id) || masterEditLevel;
	}

	function setSelectedRequired(required: boolean) {
		rows = rows.map((row) => (checked.includes(row.id) ? { ...row, required } : row));

		selectNone();
	}

	function deleteRow(id: number) {
		rows = rows.filter((row) => row.id !== id);
		checked = checked.filter((checkedId) => checkedId !== id);
		rowEditLevels.delete(id);
		rowEditLevels = new Map(rowEditLevels);
	}

	function addRow() {
		if (!newRow.title.trim()) return;

		const nextId = Math.max(...rows.map((r) => r.id)) + 1;
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

		rows.push(rowToAdd);

		// Reset form
		newRow.title = '';
		newRow.placeholder = '';
		newRow.defaultChecked = false;
		newRow.options = '';
		newRow.minDate = '';
		newRow.maxDate = '';
		newRow.required = false;

		// Focus title input for next entry
		titleInput?.focus();
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

<div class="p-4">
	<h1 class="mb-4 text-lg">RW Forms Table View Mockup</h1>

	<div class="bg-base-200 mb-4 rounded-lg p-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Toggle expanded controls</legend>
			<div class="flex gap-4">
				<label class="label cursor-pointer gap-2">
					<input
						type="radio"
						name="masterEdit"
						class="radio radio-sm"
						value="none"
						checked={masterEditLevel === 'none'}
						onchange={() => setAllEditLevel('none')}
					/>
					<span class="label-text">None</span>
				</label>
				<label class="label cursor-pointer gap-2">
					<input
						type="radio"
						name="masterEdit"
						class="radio radio-sm"
						value="basic"
						checked={masterEditLevel === 'basic'}
						onchange={() => setAllEditLevel('basic')}
					/>
					<span class="label-text">Basic</span>
				</label>
				<label class="label cursor-pointer gap-2">
					<input
						type="radio"
						name="masterEdit"
						class="radio radio-sm"
						value="all"
						checked={masterEditLevel === 'all'}
						onchange={() => setAllEditLevel('all')}
					/>
					<span class="label-text">All</span>
				</label>
			</div>
		</fieldset>
	</div>

	<div class="my-4 overflow-x-auto">
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
				{#each rows as row}
					<tr>
						<td>
							<input
								type="checkbox"
								checked={checked.includes(row.id)}
								onclick={(c: Event) => {
									if (c.target.checked) {
										checked.push(row.id);
									} else {
										checked = checked.filter((id) => id !== row.id);
									}
								}}
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
								<button class="btn btn-ghost btn-xs" onclick={() => moveUp(row.id)}>
									<SvgIcon type="mdi" path={mdiArrowUp} size="20"></SvgIcon>
								</button>

								<button class="btn btn-ghost btn-xs" onclick={() => moveDown(row.id)}>
									<SvgIcon type="mdi" path={mdiArrowDown}></SvgIcon>
								</button>

								<button class="btn btn-ghost btn-xs" onclick={() => toggleEdit(row.id)}>
									<SvgIcon type="mdi" path={mdiLeadPencil} size="20"></SvgIcon>
								</button>

								<button class="btn btn-ghost btn-xs" onclick={() => deleteRow(row.id)}>
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
									<li><a href="#">Additional actions</a></li>
									<li><a href="#">Go in this menu</a></li>
								</ul>
							</div>
						</td>
					</tr>
					{#if getEffectiveEditLevel(row.id) !== 'none'}
						<tr class="bg-base-100">
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
								{#if getEffectiveEditLevel(row.id) === 'all'}
									<div class="mt-8 flex flex-wrap gap-8">
										<fieldset class="fieldset">
											<legend class="fieldset-legend p-0">Conditional logic</legend>
											<textarea class="textarea w-90" placeholder="Conditional logic..." rows="2"
											></textarea>
										</fieldset>

										<fieldset class="fieldset">
											<legend class="fieldset-legend p-0">Advanced settings</legend>
											<label class="label block cursor-pointer gap-1">
												<input type="checkbox" class="checkbox checkbox-xs" />
												<span class="label-text text-xs">Read-only</span>
											</label>
											<label class="label block cursor-pointer gap-1">
												<input type="checkbox" class="checkbox checkbox-xs" />
												<span class="label-text text-xs">Hidden</span>
											</label>
											<label class="label block cursor-pointer gap-1">
												<input type="checkbox" class="checkbox checkbox-xs" />
												<span class="label-text text-xs">Calculated</span>
											</label>
										</fieldset>
									</div>

									<fieldset class="fieldset mt-8">
										<legend class="fieldset-legend p-0">Even more settings</legend>
										<div>
											<p class="mb-2">
												In the unfathomable recesses of that enigmatically esoteric and clandestine
												metropolis, the very articulation of whose dread nomenclature was a
												profanation of cosmic proportions, I embarked upon a venture, my cerebration
												weighed down by the ineffable arcana that lay ensconced beneath the aegis of
												hoary antiquity. The monstrous assemblages of eldritch architecture loomed
												with an inscrutable grandiosity, their imperious stones etched with cryptic
												symbols and sigils, from which emanated the dread-laden murmurings of
												primordial entities, whose dread dominion extended from the abysmal abysses
												of cosmic nothingness.
											</p>
											<p>
												I traversed the serpentine byways, their convoluted passageways and
												non-Euclidean angles bearing witness to an architectural nightmare, born of
												a disquieting, multidimensional geometry. The very atmosphere reeked of a
												palpable sense of foreboding, as though the very æther itself were saturated
												with the malevolence of beings that existed beyond the outer limits of
												mortal comprehension. A mephitic and brackish fragrance wafted from the
												inscrutable quays, where spectral barques with sails resembling spectral
												pinions lay moored, their skeletal crews haunted by the horrors they had
												witnessed in their accursed sojourns through the unfathomable abysses of
												existence.
											</p>
										</div>
									</fieldset>
								{/if}
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	{#if checked.length > 0}
		<div class="bg-base-200 mt-4 flex items-center justify-between rounded-lg p-4">
			<span class="text-sm">
				{checked.length} row{checked.length === 1 ? '' : 's'} selected
			</span>
			<span class="flex gap-2">
				<button class="btn btn-sm" onclick={selectNone}>
					<SvgIcon type="mdi" path={mdiSquareRoundedOutline} size="16"></SvgIcon>
					Deselect all
				</button>
				<button class="btn btn-sm" onclick={() => setSelectedRequired(true)}>
					<SvgIcon type="mdi" path={mdiAsterisk} size="16"></SvgIcon>
					Required
				</button>
				<button class="btn btn-sm" onclick={() => setSelectedRequired(false)}>
					<SvgIcon type="mdi" path={mdiCircleOutline} size="16"></SvgIcon>
					Optional
				</button>
				<button class="btn btn-error btn-sm" onclick={deleteSelected}>
					<SvgIcon type="mdi" path={mdiTrashCan} size="16"></SvgIcon>
					Delete selected
				</button>
			</span>
		</div>
	{/if}

	<!-- Add New Row Section -->
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
					onkeydown={(e) => e.key === 'Enter' && addRow()}
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
				<button class="btn btn-primary" onclick={addRow} disabled={!newRow.title.trim()}>
					Add Field
				</button>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">&nbsp;</legend>
				<button class="btn" onclick={cancelAddRow}> Cancel </button>
			</fieldset>
		</div>
	</div>
</div>
