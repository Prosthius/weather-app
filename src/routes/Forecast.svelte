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
	import Paper from '@smui/paper/src/Paper.svelte';
	import IconButton, { Icon } from '@smui/icon-button';
	import CircularProgress from '@smui/circular-progress';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCloudRain } from '@fortawesome/free-solid-svg-icons/faCloudRain';
	import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
	import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
	import { faSnowflake } from '@fortawesome/free-solid-svg-icons/faSnowflake';
	import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons/faCloudSunRain';
	import { faCloudSun } from '@fortawesome/free-solid-svg-icons/faCloudSun';
	import { faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons/faCloudShowersHeavy';
	import { faCloudBolt } from '@fortawesome/free-solid-svg-icons/faCloudBolt';
	import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';

	let panelOpen: boolean[] = [false];
	let currentForecast: Forecast;

	const unsubscribe = forecast.subscribe((value) => {
		currentForecast = value;
	});

	onMount(() => {});

	onDestroy(() => {
		unsubscribe();
	});

	function setWeatherIcon(weatherDescription: string) {
		switch (true) {
			case /scattered clouds/.test(weatherDescription):
				return faCloudSun;
			case /heavy rain/.test(weatherDescription):
				return faCloudShowersHeavy;
			case /moderate rain/.test(weatherDescription):
				return faCloudShowersHeavy;
			case /overcast/.test(weatherDescription):
				return faCloud;
			case /rain/.test(weatherDescription):
				return faCloudRain;
			case /storm/.test(weatherDescription):
				return faCloudBolt;
			case /wind/.test(weatherDescription):
				return faWind;
			case /snow/.test(weatherDescription):
				return faSnowflake;
			case /cloud/.test(weatherDescription):
				return faCloud;
			case /clear/.test(weatherDescription):
				return faSun;
			default:
				return faCloudSun;
		}
	}
</script>

<Paper style="padding: 21px 20px;">
	<h2 class="shadow-text">Daily Forecast</h2>
</Paper>

{#if currentForecast.daily.length === 0}
	<div class="centred-horizontal" style="margin-top: 70px;">
		<CircularProgress style="height: 100px; width: 100px" indeterminate />
	</div>
{:else}
	{#each currentForecast.daily as day, i}
		{#if i > 0}
			<div style="margin-top: 10px; margin-bottom: 10px;">
				<Accordion>
					<Panel bind:open={panelOpen[i]}>
						<Header style="position: relative; display: flex; align-items: center; height: 96px;">
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
							<span slot="description" class="align-right">
								<FontAwesomeIcon icon={setWeatherIcon(day.weather[0].description)} size="2x" />
							</span>
						</Header>
						<Content style="margin: 0; padding: 0;">
							<div class="main-body">
								<LayoutGrid style="padding-bottom: 10px;">
									<Cell spanDevices={{ desktop: 5, tablet: 2, phone: 2 }}>
										Max&nbsp;<b>{day.temp.max.toFixed(1)}&deg;</b>
									</Cell>
									<Cell spanDevices={{ desktop: 5, tablet: 2, phone: 2 }}>
										Min&nbsp;<b>{day.temp.min.toFixed(1)}&deg;</b>
									</Cell>
								</LayoutGrid>
								<LayoutGrid style="padding-top: 0;">
									<Cell span={12}>
										{@html formatString(day.weather[0].description)}
									</Cell>
								</LayoutGrid>
								<LayoutGrid style="padding: 0 10; transform: translateY(-7px);">
									<Cell span={12}>
										<u>Rain</u>
									</Cell>
									{#if day.rain}
										<Cell span={12} style="transform: translateY(-10px);">
											<b>{day.pop * 100}% </b>chance <b>{day.rain}mm</b>
										</Cell>
									{:else}
										<Cell span={12} style="transform: translateY(-10px);">
											<b>No rain</b>
										</Cell>
									{/if}
								</LayoutGrid>
								<LayoutGrid style="padding: 0 10; transform: translateY(-20px);">
									<Cell span={12} style="padding-top: 0;">
										<u>Wind</u>
									</Cell>
									<Cell span={12} style="transform: translateY(-10px);">
										<b>
											{degreeToCardinal(day.wind_deg)}&nbsp;{day.wind_speed.toFixed(0)}km/h
										</b>
									</Cell>
									<Cell span={12} style="transform: translateY(-20px);">
										Gust
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
{/if}

<footer />

<style>
	footer {
		height: 100px;
	}

	h5 {
		margin: 0;
		position: absolute;
		transform: translateY(-32px);
	}

	h2 {
		margin: 30px 0px;
	}

	.main-body {
		font-size: 1.3rem;
	}

	span {
		position: relative;
	}
</style>
