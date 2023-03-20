<script lang="ts">
	import {
		unixToLocaleDay,
		unixToLocaleDate,
		degreeToCardinal,
		getWeather,
		forecast
	} from '../lib/helper';
	import type { Forecast } from '../lib/interfaces';
	import { onDestroy, onMount } from 'svelte';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

	let forecastPromise: Promise<Forecast> = Promise.resolve(forecast);

	onMount(() => {
		forecastPromise = new Promise((resolve) => {
			const waitForForecast = () => {
				if (forecast) {
					resolve(forecast);
				} else {
					setTimeout(waitForForecast, 100);
				}
			};
			waitForForecast();
		});
	});
</script>

<h2>Daily Forecast</h2>
{#await forecastPromise then forecast}
	{#each forecast.daily as day, i}
		{#if i > 0}
			<div style="margin-top: 10px; margin-bottom: 10px;">
				<Accordion>
					<Panel>
						<Header>
							<b>{unixToLocaleDay(Number(day.dt))}</b>
							{unixToLocaleDate(Number(day.dt))}
						</Header>
						<Content>
							{day.temp.day.toFixed(1)}&deg;
						</Content>
					</Panel>
				</Accordion>
			</div>
		{/if}
	{/each}
{/await}

<footer />

<style>
	footer {
		height: 100px;
	}
</style>
