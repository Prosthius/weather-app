<script lang="ts">
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
	import { unixToLocale, degreeToCardinal } from '../lib/helper';
	import { onDestroy, onMount } from 'svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import CircularProgress from '@smui/circular-progress';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	// import * as helper from '$lib';

	let cityNameDefault: string = 'Warranwood';
	let locationCoords: any;
	let forecast: any;
	export let currentWeather: any;
	export let currentWeatherName: string;
	$: currentWeatherName = currentWeather?.name;
	let timeout: any;
	let fiveMinTimeout: any;
	$: windSpeed = currentWeather?.wind?.speed.toFixed(0);
	$: windSpeedTrue = windSpeed > 0 ? true : false;
	let hour: number;
	$: past18Hundred = hour >= 18 ? true : false;

	onMount(async () => {
		hour = new Date().getHours();
		console.log(hour);
		scheduleGetWeather();
		await getLocation(cityNameDefault);
		await getWeather();
		// await getMinMaxTemp();
		scheduleWeatherUpdate();
	});

	onDestroy(() => {
		clearTimeout(timeout);
		clearTimeout(fiveMinTimeout);
	});

	function scheduleGetWeather() {
		fiveMinTimeout = setTimeout(async () => {
			await getWeather();
			scheduleGetWeather();
		}, 3600000);
	}

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

	async function getWeather() {
		let res: any = await fetch(
			`https://api.openweathermap.org/data/3.0/onecall?lat=${locationCoords.lat}&lon=${locationCoords.lon}&units=metric&appid=${apiKey}`
		);
		let json: any = await res.json();
		forecast = json;
		console.log(forecast);
	}

	export async function getLocation(city: string) {
		console.log('getLocation()');
		let res: any = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()},AU&limit=1&appid=${apiKey}`
		);
		let json: any = await res.json();
		locationCoords = json[0];
		await getWeather();
		await getCurrentWeather();
	}
</script>

{#if currentWeather && forecast}
	<LayoutGrid class="border">
		<Cell spanDevices={{ desktop: 6, tablet: 6, phone: 4 }}>
			<h2 class="shadow-text" style="margin-top: 0px;">
				{currentWeatherName}
				<h3 style="margin-bottom: 0px; margin-top: 10px;">
					<b>{currentWeather.main.temp.toFixed(1)}&deg;</b>
				</h3>
			</h2>
			<InnerGrid>
				<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
					<h4 class="small-cell" style="margin-top: 0px;">
						Feels Like <br /> <b>{currentWeather.main.feels_like.toFixed(1)}&deg;</b>
					</h4>
				</Cell>
				{#if past18Hundred}
					<Cell spanDevices={{ desktop: 4, tablet: 3, phone: 1 }}>
						<h4 class="small-cell" style="margin-top: 0px;">
							Max Tomorrow <b>{forecast?.daily[1].temp.max.toFixed(1)}&deg;</b>
						</h4>
					</Cell>
				{:else}
					<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 1 }}>
						<h4 class="small-cell" style="margin-top: 0px;">
							Max <b>{forecast?.daily[0].temp.max.toFixed(1)}&deg;</b>
						</h4>
					</Cell>
				{/if}
				<Cell spanDevices={{ desktop: 2, tablet: 2, phone: 1 }}>
					<h4 class="small-cell" style="margin-top: 0px;">
						Min <b>{forecast?.daily[0].temp.min.toFixed(1)}&deg;</b>
					</h4>
				</Cell>
			</InnerGrid>
		</Cell>
		<!-- <Cell spanDevices={{ desktop: 4, tablet: 1, phone: 0 }} class="border" /> -->
	</LayoutGrid>
	<LayoutGrid class="border">
		<Cell spanDevices={{ desktop: 4, tablet: 4, phone: 2 }} class="align-top">
			{#if windSpeedTrue}
				<h4 class="" style="margin-top: 0px;">
					Wind
					<b>
						{degreeToCardinal(currentWeather.wind.deg)}
						{currentWeather.wind.speed.toFixed(0)}km/h
						<br />
					</b>
					{#if currentWeather.wind.gust}
						Gust&#x202f; <!-- U+202F NARROW NO-BREAK SPACE -->
						<b>
							{currentWeather.wind.gust?.toFixed(0)}km/h
						</b>
					{/if}
				</h4>
			{:else}
				<h4 style="margin-top: 0px; margin: 0 0px">Wind <b>Calm</b></h4>
			{/if}
		</Cell>
		<Cell spanDevices={{ desktop: 4, tablet: 4, phone: 2 }}>
			<h4 style="margin-top: 0px; margin-">Humidity <b>{currentWeather.main.humidity}%</b></h4>
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
	.shadow-text {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.274);
	}

	.small-cell {
		height: 60px;
		margin-top: 10px;
	}

	/* * :global(.cell) {
		margin-top: 0px;
		margin-right: 1000px;
	} */
</style>
