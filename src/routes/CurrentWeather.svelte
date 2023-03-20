<script lang="ts">
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
	import { degreeToCardinal, getWeather, forecast, unixToLocaleTime } from '../lib/helper';
	import { onDestroy, onMount } from 'svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import CircularProgress from '@smui/circular-progress';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	import Paper from '@smui/paper/src/Paper.svelte';
	// import * as helper from '$lib';

	let cityNameDefault: string = 'Warranwood';
	let locationCoords: any = 'placeholder';
	// export let forecast: any;
	export let currentWeather: any;
	let currentWeatherDescription: string;
	let currentWeatherName: string;
	$: currentWeatherName = currentWeather?.name;
	let timeout: any;
	let getWeatherTimeout: any;
	$: windSpeed = currentWeather?.wind?.speed.toFixed(0);
	$: windSpeedTrue = windSpeed > 0 ? true : false;
	let hour: number;
	$: past18Hundred = hour >= 18 ? true : false;
	let getLocationPromise: any;
	let getCurrentWeatherPromise: any;

	onMount(async () => {
		getLocationPromise = await getLocation(cityNameDefault);
		scheduleGetWeather();
		scheduleWeatherUpdate();
	});

	onDestroy(() => {
		clearTimeout(timeout);
		clearTimeout(getWeatherTimeout);
	});

	function scheduleGetWeather() {
		getWeatherTimeout = setTimeout(async () => {
			await getWeather(); // Limited to 1000 calls per day
			scheduleGetWeather();
		}, 3600000); // One hour
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
		currentWeatherDescription = await formatWeatherDescription();
		// console.log(currentWeather);
	}

	async function formatWeatherDescription() {
		let currentWeatherDescription: string = await currentWeather?.weather[0]?.description;
		let currentWeatherDescSplit = currentWeatherDescription.split(' ');
		let currentWeatherDescCapitalized = currentWeatherDescSplit.map((word: any) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		return currentWeatherDescCapitalized.join('&nbsp;');
	}

	export async function getLocation(city: string) {
		try {
			let res: any = await fetch(
				`https://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()},AU&limit=1&appid=${apiKey}`
			);
			let json: any = await res.json();
			locationCoords = json[0];
			await getWeather();
			getCurrentWeatherPromise = await getCurrentWeather();
			return true;
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if locationCoords === undefined}
	<h2>Error: Unknown location</h2>
{:else if currentWeather && forecast}
	<Paper variant="outlined">
		<LayoutGrid>
			<Cell spanDevices={{ desktop: 6, tablet: 6, phone: 4 }}>
				<h2 class="shadow-text" style="margin-top: 0px; whitespace: nowrap;">
					{currentWeatherName}
					<h3 style="margin-top: 0px; display: inline; word-break: break-word;">
						{@html currentWeatherDescription}
					</h3>
					<h3 style="margin-bottom: 0px; margin-top: 10px;">
						<b>{currentWeather.main.temp.toFixed(1)}&deg;</b>
					</h3>
				</h2>
				<InnerGrid>
					<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
						<h4>
							Feels Like <br /> <b>{currentWeather.main.feels_like.toFixed(1)}&deg;</b>
						</h4>
					</Cell>
					{#if past18Hundred}
						<Cell spanDevices={{ desktop: 4, tablet: 3, phone: 1 }}>
							<h4>
								Max Tomorrow <b>{forecast?.daily[1].temp.max.toFixed(1)}&deg;</b>
							</h4>
						</Cell>
					{:else}
						<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 1 }}>
							<h4>
								Max <b>{forecast?.daily[0].temp.max.toFixed(1)}&deg;</b>
							</h4>
						</Cell>
					{/if}
					<Cell spanDevices={{ desktop: 2, tablet: 2, phone: 1 }}>
						<h4>
							Min <b>{forecast?.daily[0].temp.min.toFixed(1)}&deg;</b>
						</h4>
					</Cell>
				</InnerGrid>
			</Cell>
		</LayoutGrid>
	</Paper>
	<Paper variant="outlined">
		<LayoutGrid>
			<Cell spanDevices={{ desktop: 4, tablet: 4, phone: 3 }} class="align-top">
				{#if windSpeedTrue}
					<h4>
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
					<h4>Wind <b>Calm</b></h4>
				{/if}
			</Cell>
			<Cell>
				<h4 style="margin-top: 0px; margin-bottom: 0px;">
					Humidity <b>{currentWeather.main.humidity}%</b>
					<br />
					Pressure <b>{currentWeather.main.pressure}&nbsp;hPa</b>
				</h4>
			</Cell>
		</LayoutGrid>
	</Paper>
	<Paper variant="outlined">
		<LayoutGrid>
			<Cell class="align-top">
				<h4>
					Sunrise <b>{unixToLocaleTime(currentWeather.sys.sunrise)}</b>
					<br />
					Sunset&nbsp; <b>{unixToLocaleTime(currentWeather.sys.sunset)}</b>
				</h4>
			</Cell>
		</LayoutGrid>
	</Paper>
{:else}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{/if}

<style>
	.shadow-text {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.274);
	}

	h4 {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	* :global(.section) {
		border: 1px solid red;
	}
</style>
