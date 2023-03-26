<script lang="ts">
	import {
		degreeToCardinal,
		getForecast,
		forecast,
		unixToLocaleTime,
		formatString
	} from '../lib/helper';
	import type { Forecast } from '../lib/interfaces/Forecast';
	import type { LocationCoords } from '../lib/interfaces/LocationCoords';
	import { onDestroy, onMount } from 'svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import CircularProgress from '@smui/circular-progress';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	import Paper from '@smui/paper/src/Paper.svelte';
	import type { Unsubscriber } from 'svelte/store';
	
	let cityNameDefault: string = 'Melbourne';
	let locationCoords: LocationCoords;
	export let currentWeather: any;
	let currentWeatherDescription: string;
	let currentWeatherName: string;
	$: currentWeatherName = currentWeather?.name;
	let timeout: any;
	let getWeatherTimeout: any;
	$: windSpeed = currentWeather?.wind?.speed.toFixed(0);
	$: windSpeedTrue = windSpeed > 0 ? true : false;
	let hour: number = new Date().getHours();
	$: past18Hundred = hour >= 18 ? true : false;
	let currentForecast: Forecast;
	let promptPromise: Promise<void> = new Promise<void>((resolve, reject) => {});

	let unsubscribe: Unsubscriber = forecast.subscribe((value: Forecast) => {
		currentForecast = value;
	});

	onMount(() => {
		promptPromise = promptLocation();
		scheduleGetWeather();
		scheduleWeatherUpdate();
	});

	onDestroy(() => {
		clearTimeout(timeout);
		clearTimeout(getWeatherTimeout);
		unsubscribe();
	});

	function scheduleGetWeather() {
		getWeatherTimeout = setTimeout(async () => {
			await getForecast(locationCoords.lat, locationCoords.lon); // Limited to 1000 calls per day
			console.log(forecast);
			scheduleGetWeather();
		}, 3600000); // One hour
	}

	function scheduleWeatherUpdate() {
		timeout = setTimeout(async () => {
			await getCurrentWeather();
			scheduleWeatherUpdate();
			hour = new Date().getHours();
		}, 60000);
	}

	async function getCurrentWeather() {
		let res: any = await fetch(
			`https://current.weather.callumhopkins.au/weather?lat=${locationCoords.lat}&lon=${locationCoords.lon}`
		);
		let json: any = await res.json();
		currentWeather = json;
		currentWeatherDescription = formatString(currentWeather?.weather[0]?.description);
	}

	export async function getLocation(city: string) {
		try {
			locationCoords = {
				lat: 0,
				lon: 0
			};
			forecast.set({
				lat: 0,
				lon: 0,
				timezone: '',
				timezone_offset: 0,
				daily: []
			});
			let res: any = await fetch(`https://geo.weather.callumhopkins.au/geo?city=${city}`);
			let json: any = await res.json();
			locationCoords = json[0];

			await getForecast(locationCoords.lat, locationCoords.lon);
			await getCurrentWeather();
			return true;
		} catch (error) {
			console.log(error);
		}
	}

	async function promptLocation(): Promise<void> {
		try {
			const position: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});
			locationCoords = {
				lat: position.coords.latitude,
				lon: position.coords.longitude
			};
			await getForecast(position.coords.latitude, position.coords.longitude);
			await getCurrentWeather();
		} catch (error) {
			console.error(error);
			locationCoords = {
				lat: 0,
				lon: 0
			};
			await getLocation(cityNameDefault);
			await getForecast(locationCoords.lat, locationCoords.lon);
			await getCurrentWeather();
		}
	}
</script>

<Paper style="padding: 1px 20px; margin: 0px 0px 10px 0px;">
	<h2 class="shadow-text">Current Weather</h2>
</Paper>

{#await promptPromise}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:then}
	{#if locationCoords === undefined}
		<h2>Error: Unknown location</h2>
	{:else if currentWeather && forecast}
		<Paper style="margin-bottom: 10px; padding: 20px 0px;">
			<LayoutGrid>
				<Cell spanDevices={{ desktop: 7, tablet: 6, phone: 4 }}>
					<h2 class="shadow-text current-weather-name" style="margin-top: 0px; whitespace: nowrap;">
						{currentWeatherName}
						<h3 class="weather-description">
							<br />{@html currentWeatherDescription}
						</h3>
						<h3 style="margin-bottom: 0px; margin-top: 10px;">
							<b>{currentWeather.main.temp.toFixed(1)}&deg;</b>
						</h3>
					</h2>
					<InnerGrid>
						<Cell spanDevices={{ desktop: 7, tablet: 4, phone: 2 }}>
							<h4>
								Feels&nbsp;Like <br /> <b>{currentWeather.main.feels_like.toFixed(1)}&deg;</b>
							</h4>
						</Cell>
						{#if past18Hundred}
							<Cell spanDevices={{ desktop: 4, tablet: 2, phone: 1 }}>
								<h4>
									Max Tomorrow <b>{currentForecast?.daily[1].temp.max.toFixed(1)}&deg;</b>
								</h4>
							</Cell>
						{:else}
							<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 1 }}>
								<h4>
									Max <b>{currentForecast?.daily[0].temp.max.toFixed(1)}&deg;</b>
								</h4>
							</Cell>
						{/if}
						<Cell spanDevices={{ desktop: 1, tablet: 2, phone: 1 }}>
							<h4 style="margin-left: 10px;">
								Min <b>{currentForecast?.daily[0].temp.min.toFixed(1)}&deg;</b>
							</h4>
						</Cell>
					</InnerGrid>
				</Cell>
			</LayoutGrid>
		</Paper>
		<Paper style="margin-bottom: 10px; padding: 20px 0px;">
			<LayoutGrid>
				<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 4 }}>
					{#if windSpeedTrue}
						<h4>
							Wind
							<b>
								{degreeToCardinal(currentWeather.wind.deg)}&nbsp;{currentWeather.wind.speed.toFixed(
									0
								)}km/h
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
				<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 4 }}>
					<h4 style="margin-top: 0px; margin-bottom: 0px;">
						Pressure <b>{currentWeather.main.pressure}&nbsp;hPa</b>
						<br />
						Humidity&nbsp;<b>{currentWeather.main.humidity}%</b>
					</h4>
				</Cell>
			</LayoutGrid>
			<LayoutGrid>
				<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
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
{/await}

<style>
	h4 {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	div {
		border: 2px solid var(--mdc-theme-secondary);
	}

	.weather-description {
		margin-top: 0px;
		display: inline;
		font-size: 2.5rem;
	}

	.current-weather-name {
		font-weight: 400;
	}
</style>
