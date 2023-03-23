<script lang="ts">
	import {
		unixToLocaleDay,
		unixToLocaleDate,
		forecast,
		formatString,
		degreeToCardinal
	} from '../lib/helper';
	import type { Forecast } from '../lib/interfaces';
	import { onDestroy, onMount } from 'svelte';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import InnerGrid from '@smui/layout-grid/src/InnerGrid.svelte';
	import Paper from '@smui/paper/src/Paper.svelte';
	import IconButton, { Icon } from '@smui/icon-button';
	import CircularProgress from '@smui/circular-progress';

	let forecastPromise: Promise<Forecast> = Promise.resolve(forecast);
	let panelOpen: boolean[] = [false];

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

{#await forecastPromise}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:then forecast}
	<Paper>
		<h2 class="shadow-text">Daily Forecast</h2>
	</Paper>
	{#each forecast.daily as day, i}
		{#if i > 0}
			<div style="margin-top: 10px; margin-bottom: 10px;">
				<Accordion>
					<Panel bind:open={panelOpen[i]}>
						<Header>
							{#if i === 1}
								<h5>
									<b>Tomorrow</b>
									<br />
									{unixToLocaleDate(Number(day.dt))}
								</h5>
							{:else}
								<h5>
									<b>{unixToLocaleDay(Number(day.dt))}</b>
									<br />
									{unixToLocaleDate(Number(day.dt))}
								</h5>
							{/if}
							<IconButton slot="icon" toggle pressed={panelOpen[i]}>
								<Icon class="material-icons" on>expand_less</Icon>
								<Icon class="material-icons">expand_more</Icon>
							</IconButton>
						</Header>
						<Content style="margin: 0; padding: 0;">
							<div class="main-body">
								<LayoutGrid style="padding-bottom: 10px;">
									<Cell spanDevices={{ desktop: 5, tablet: 4, phone: 2 }}>
										Max&nbsp;<b>{day.temp.max.toFixed(1)}&deg;</b>
									</Cell>
									<Cell spanDevices={{ desktop: 5, tablet: 4, phone: 2 }}>
										Min&nbsp;<b>{day.temp.min.toFixed(1)}&deg;</b>
									</Cell>
								</LayoutGrid>
								<LayoutGrid style="padding-top: 0;">
									<Cell span={1}>
										{@html formatString(day.weather[0].description)}
									</Cell>
								</LayoutGrid>
								<LayoutGrid style="padding-top: 0;">
									<Cell span={12}>
										<u>Rain</u>
									</Cell>
									<Cell span={12} style="transform: translateY(-10px);">
										<b>{day.pop * 100}% </b>chance of <b>{day.rain}mm</b>
									</Cell>
								</LayoutGrid>
								<LayoutGrid>
									<Cell style="padding-top: 0;">
										Wind
										<b>
											{degreeToCardinal(day.wind_deg)}&nbsp;{day.wind_speed.toFixed(0)}km/h
										</b>
										<br />
										Gust&#x202f; <!-- U+202F NARROW NO-BREAK SPACE -->
										<b>
											{day.wind_gust?.toFixed(0)}km/h
										</b>
									</Cell>
								</LayoutGrid>
							</div>
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

	h5 {
		margin: 0;
		/* padding: 0; */
	}

	h2 {
		margin: 30px 0px;
	}

	.main-body {
		font-size: 1.3rem;
	}
</style>
