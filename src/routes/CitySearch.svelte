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

<CurrentWeather bind:getLocation bind:currentWeather />
<Outlook />

<style>
	.container {
		padding: 36px 18px;
		background-color: var(--mdc-theme-background, #f8f8f8);
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
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
	* :global(.solo-input) {
		flex-grow: 1;
		color: var(--mdc-theme-on-surface, #000);
	}
	* :global(.solo-input::placeholder) {
		color: var(--mdc-theme-on-surface, #000);
		opacity: 0.6;
	}
	* :global(.solo-fab) {
		flex-shrink: 0;
	}
	* :global(.align-left) {
		display: flex;
		justify-content: flex-start;
	}
</style>
