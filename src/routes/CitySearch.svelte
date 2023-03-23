<script lang="ts">
	import CurrentWeather from './CurrentWeather.svelte';
	import { Icon } from '@smui/fab';
	import Textfield, { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import Outlook from './Outlook.svelte';

	let cityNameInput: string;
	let cityNameSaved: string;
	let getLocation: any;
	let currentWeather: any;

	function updateLocation() {
		cityNameSaved = cityNameInput;
		currentWeather = '';
		cityNameInput = '';
		getLocation(cityNameSaved);
	}

	function handleSearchEnterPress(event: CustomEvent | KeyboardEvent) {
		event = event as KeyboardEvent;
		event.key === 'Enter' ? updateLocation() : null;
	}
</script>

<div class="container" style="padding: 0px;">
	<LayoutGrid>
		<Cell span={12} class="centre">
			<Paper class="solo-paper" elevation={6}>
				<Icon class="material-icons">search</Icon>
				<Input
					bind:value={cityNameInput}
					on:keydown={handleSearchEnterPress}
					placeholder="Search for a Suburb or City"
					class="solo-input"
				/>
			</Paper>
			<Fab on:click={updateLocation} color="primary" mini class="solo-fab">
				<Icon class="material-icons">arrow_forward</Icon>
			</Fab>
		</Cell>
	</LayoutGrid>
</div>

<LayoutGrid span={12}>
	<Cell span={8}>
		<CurrentWeather bind:getLocation bind:currentWeather />
	</Cell>
	<Cell spanDevices={{ desktop: 4, tablet: 8, phone: 4 }}>
		<Outlook />
	</Cell>
</LayoutGrid>

<style>
	.container {
		padding: 36px 18px;
	}
	* :global(.solo-paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 0 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.solo-paper > *) {
		display: inline-block;
		margin: 0 12px;
	}
	* :global(input) {
		color: var(--mdc-theme-on-surface);
	}
	* :global(Input::placeholder) {
		color: var(--mdc-theme-on-surface);
		opacity: 0.6;
	}
	* :global(.solo-fab) {
		flex-shrink: 0;
	}
</style>
