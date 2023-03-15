<script lang="ts">
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
	import { unixToLocale, degreeToCardinal } from '../lib/helper';
	import { onDestroy, onMount } from 'svelte';
	import Fab, { Icon } from '@smui/fab';
	import Textfield from '@smui/textfield';
	// import * as helper from '$lib';

	let cityName: string = 'Melbourne';
	let locationCoords: any;
	let currentWeather: any;
    let timeout: any;

	onMount(async () => {
		await getLocation(cityName);
		scheduleWeatherUpdate();
	});

	function scheduleWeatherUpdate() {
		timeout = setTimeout(async () => {
			console.log('setInterval()');
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
		console.log(currentWeather);
	}

	async function getLocation(city: string) {
		console.log('getLocation()');
		let res: any = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${city},AU&limit=1&appid=${apiKey}`
		);
		let json: any = await res.json();
		locationCoords = json[0];
		console.log(cityName);
		await getCurrentWeather();
	}

	function updateCityName() {
        clearTimeout(timeout);
		getLocation(cityName);
	}
</script>

<Textfield bind:value={cityName} variant="outlined" label="City Name" />
<Fab>
	<Icon class="material-icons" on:click={updateCityName}>arrow_forward</Icon>
</Fab>

{#if currentWeather}
	<h1>{currentWeather.name}</h1>
	<h1>Current Temperature: {currentWeather.main.temp.toFixed(1)}&deg;</h1>
	<h1>Feels Like: {currentWeather.main.feels_like.toFixed(1)}&deg;</h1>
	<h1>Max: {currentWeather.main.temp_max.toFixed(1)}&deg;</h1>
	<h1>Min: {currentWeather.main.temp_min.toFixed(1)}&deg;</h1>
	<h1>Humidity: {currentWeather.main.humidity}%</h1>
	{#if !currentWeather.wind.speed.toFixed(0)}
		<h1>Wind: Calm {currentWeather.wind.speed.toFixed(0)}km/h</h1>
	{:else}
		<h1>
			Wind: {degreeToCardinal(currentWeather.wind.deg)}
			{currentWeather.wind.speed.toFixed(0)}km/h
		</h1>
	{/if}
	<h1>Sunrise: {unixToLocale(currentWeather.sys.sunrise)}</h1>
	<h1>Sunset: {unixToLocale(currentWeather.sys.sunset)}</h1>
{:else}
	<h1>Loading...</h1>
{/if}
