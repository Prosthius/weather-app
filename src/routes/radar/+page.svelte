<script lang="ts">
	import type { LocationCoords } from '$lib/interfaces/LocationCoords';
	import { locationCoords } from '$lib/apiCalls';
	import { PUBLIC_API_KEY as apiKey } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	import L from 'leaflet';
	import type { Unsubscriber } from 'svelte/store';

	const mapLayer: string = 'precipitation_new';
	const baseUrl: string = 'https://tile.openweathermap.org/map';
	let mapElement: HTMLDivElement;
	let locationCoordsLocal: LocationCoords;
	let locationCoordsUnsubscribe: Unsubscriber = locationCoords.subscribe(
		(value: LocationCoords) => {
			locationCoordsLocal = value;
		}
	);

	onMount(async () => {
		console.log(locationCoordsLocal);
		const map = L.map(mapElement).setView([locationCoordsLocal.lat, locationCoordsLocal.lon], 13);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		L.tileLayer(`${baseUrl}/${mapLayer}/{z}/{x}/{y}/.png?appid=${apiKey}`, {
			attribution: 'Map data &copy; OpenWeatherMap',
			maxZoom: 19,
            opacity: 1
		}).addTo(map);
	});

	onDestroy(() => {
		locationCoordsUnsubscribe();
	});
</script>

<div class="border" id="map" bind:this={mapElement} />

<style>
	@import 'leaflet/dist/leaflet.css';
	#map {
		height: 500px;
		width: 100%;
	}
</style>
