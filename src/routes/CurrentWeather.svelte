<script lang="ts">
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
	import { unixToLocale, degreeToCardinal } from '../lib/helper';
	import { onDestroy, onMount } from 'svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import CircularProgress from '@smui/circular-progress';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	// import * as helper from '$lib';

	let cityNameDefault: string = 'Melbourne';
	export let cityNameSaved: string;
	let locationCoords: any;
	let currentWeather: any;
	export let currentWeatherName: string;
	$: currentWeatherName = currentWeather?.name;
	let timeout: any;

	onMount(async () => {
		await getLocation(cityNameDefault);
		scheduleWeatherUpdate();
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});

	function scheduleWeatherUpdate() {
		timeout = setTimeout(async () => {
			await getCurrentWeather();
			scheduleWeatherUpdate();
		}, 60000);
	}

	async function getCurrentWeather() {
		let res: any = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${locationCoords.lat}&lon=${locationCoords.lon}&units=metric&appid=${apiKey}`
		);
		let json: any = await res.json();
		currentWeather = json;
		// console.log(currentWeather);
	}

	export async function getLocation(city: string) {
		// cityNameSaved = '';
		currentWeather = '';
		console.log('getLocation()');
		let res: any = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()},AU&limit=1&appid=${apiKey}`
		);
		let json: any = await res.json();
		locationCoords = json[0];
		await getCurrentWeather();
	}
</script>

{#if currentWeather}
	<LayoutGrid>
		<Cell>
			<h3 style="margin-bottom: 0px;">{currentWeather.main.temp.toFixed(1)}&deg;</h3>
			<InnerGrid>
				<Cell>
					<h5>Feels Like</h5>
				</Cell>
				<Cell class="centred-vertical" style="max-height: 107px; margin-left: 0px;">
					<h4 style="transform: translateX(-25px);">
						{currentWeather.main.feels_like.toFixed(1)}&deg;
					</h4>
				</Cell>
			</InnerGrid>
		</Cell>
	</LayoutGrid>
{:else}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{/if}

<!-- {#if currentWeather}
	<h3>{currentWeather.name}:</h3>
	<h3>Current Temperature: {currentWeather.main.temp.toFixed(1)}&deg;</h3>
	<h3>Feels Like: {currentWeather.main.feels_like.toFixed(1)}&deg;</h3>
	<h3>Max: {currentWeather.main.temp_max.toFixed(1)}&deg;</h3>
	<h3>Min: {currentWeather.main.temp_min.toFixed(1)}&deg;</h3>
	<h3>Humidity: {currentWeather.main.humidity}%</h3>
	{#if !currentWeather.wind.speed.toFixed(0)}
		<h3>Wind: Calm {currentWeather.wind.speed.toFixed(0)}km/h</h3>
	{:else}
		<h3>
			Wind: {degreeToCardinal(currentWeather.wind.deg)}
			{currentWeather.wind.speed.toFixed(0)}km/h
		</h3>
	{/if}
	<h3>Sunrise: {unixToLocale(currentWeather.sys.sunrise)}</h3>
	<h3>Sunset: {unixToLocale(currentWeather.sys.sunset)}</h3>
{:else}
	<h3>Loading...</h3>
{/if} -->
<style>
</style>
