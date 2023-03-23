<script lang="ts">
	import {
		degreeToCardinal,
		getWeather,
		forecast,
		unixToLocaleTime,
		formatString
	} from '../lib/helper';
	import { onDestroy, onMount } from 'svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import CircularProgress from '@smui/circular-progress';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	import Paper from '@smui/paper/src/Paper.svelte';

	let cityNameDefault: string = 'Warranwood';
	let locationCoords: any = 'placeholder';
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
			await getWeather(locationCoords.lat, locationCoords.lon); // Limited to 1000 calls per day
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
			`https://weather-api-current.callumhopkins.au/weather?lat=${locationCoords.lat}&lon=${locationCoords.lon}`
		);
		let json: any = await res.json();
		currentWeather = json;
		currentWeatherDescription = formatString(currentWeather?.weather[0]?.description);
	}

	export async function getLocation(city: string) {
		try {
			locationCoords = '';
			let res: any = await fetch(
				`https://weather-api-geo.callumhopkins.au/geo?city=${city}`
			);
			let json: any = await res.json();
			locationCoords = json[0];
			await getWeather(locationCoords.lat, locationCoords.lon);
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
			<Cell spanDevices={{ desktop: 7, tablet: 6, phone: 4 }}>
				<h2 class="shadow-text" style="margin-top: 0px; whitespace: nowrap;">
					{currentWeatherName}
					<h3 style="margin-top: 0px; display: inline;">
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
						<Cell spanDevices={{ desktop: 4, tablet: 3, phone: 1 }}>
							<h4>
								Max Tomorrow <b>{forecast?.daily[1].temp.max.toFixed(1)}&deg;</b>
							</h4>
						</Cell>
					{:else}
						<Cell spanDevices={{ desktop: 4, tablet: 2, phone: 1 }}>
							<h4>
								Max <b>{forecast?.daily[0].temp.max.toFixed(1)}&deg;</b>
							</h4>
						</Cell>
					{/if}
					<Cell spanDevices={{ desktop: 1, tablet: 2, phone: 1 }}>
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
	</Paper>
	<Paper variant="outlined">
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

<style>
	h4 {
		margin-top: 0px;
		margin-bottom: 0px;
	}
</style>
