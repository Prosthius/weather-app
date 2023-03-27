<script lang="ts">
	import CurrentWeather from './CurrentWeather.svelte';
	import { Icon } from '@smui/fab';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import Fab from '@smui/fab/src/Fab.svelte';
	import Forecast from './Forecast.svelte';

	let cityNameInput: string;
	let cityNameSaved: string;
	let getLocation: any;

	async function updateLocation(): Promise<void> {
		cityNameSaved = cityNameInput;
		cityNameInput = '';
		getLocation(cityNameSaved);
	}

	function handleSearchEnterPress(event: CustomEvent | KeyboardEvent): void {
		event = event as KeyboardEvent;
		event.key === 'Enter' ? updateLocation() : null;
	}
</script>

<div class="container">
	<LayoutGrid>
		<Cell span={12} class="centre">
			<Paper class="paper" elevation={6}>
				<Icon class="material-icons">search</Icon>
				<Input
					bind:value={cityNameInput}
					on:keydown={handleSearchEnterPress}
					placeholder="Search for a Suburb or City"
					class="input"
				/>
			</Paper>
			<Fab on:click={updateLocation} color="primary" mini class="fab">
				<Icon class="material-icons">arrow_forward</Icon>
			</Fab>
		</Cell>
	</LayoutGrid>
</div>

<LayoutGrid span={12}>
	<Cell spanDevices={{ desktop: 7, tablet: 8, phone: 4 }}>
		<CurrentWeather bind:getLocation />
	</Cell>
	<Cell spanDevices={{ desktop: 5, tablet: 8, phone: 4 }}>
		<Forecast />
	</Cell>
</LayoutGrid>

<style>
	.container {
		padding: 15px 0px 0px 0px;
	}
	* :global(.paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 0 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.paper > *) {
		display: inline-block;
		margin: 0 7px;
	}
	* :global(input) {
		color: var(--mdc-theme-on-surface);
	}
	* :global(Input::placeholder) {
		color: var(--mdc-theme-on-surface);
		opacity: 0.6;
	}
	* :global(.fab) {
		flex-shrink: 0;
	}
</style>
