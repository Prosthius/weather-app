import { writable } from 'svelte/store';
import type { Forecast } from './interfaces/Forecast';

export function unixToLocaleTime(unixUTC: number): string {
	let date: Date = new Date(unixUTC * 1000);
	return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function unixToLocaleDay(unixUTC: number): string {
	let date: Date = new Date(unixUTC * 1000);
	return date.toLocaleDateString(undefined, { weekday: 'long' });
}

export function unixToLocaleDate(unixUTC: number): string {
	let date: Date = new Date(unixUTC * 1000);
	return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

export function degreeToCardinal(degree: number): string {
	let cardinal: string;
	switch (true) {
		case degree >= 348.75 || degree < 11.25:
			cardinal = 'N';
			break;
		case degree >= 11.25 && degree < 33.75:
			cardinal = 'NNE';
			break;
		case degree >= 33.75 && degree < 56.25:
			cardinal = 'NE';
			break;
		case degree >= 56.25 && degree < 78.75:
			cardinal = 'ENE';
			break;
		case degree >= 78.75 && degree < 101.25:
			cardinal = 'E';
			break;
		case degree >= 101.25 && degree < 123.75:
			cardinal = 'ESE';
			break;
		case degree >= 123.75 && degree < 146.25:
			cardinal = 'SE';
			break;
		case degree >= 146.25 && degree < 168.75:
			cardinal = 'SSE';
			break;
		case degree >= 168.75 && degree < 191.25:
			cardinal = 'S';
			break;
		case degree >= 191.25 && degree < 213.75:
			cardinal = 'SSW';
			break;
		case degree >= 213.75 && degree < 236.25:
			cardinal = 'SW';
			break;
		case degree >= 236.25 && degree < 258.75:
			cardinal = 'WSW';
			break;
		case degree >= 258.75 && degree < 281.25:
			cardinal = 'W';
			break;
		case degree >= 281.25 && degree < 303.75:
			cardinal = 'WNW';
			break;
		case degree >= 303.75 && degree < 326.25:
			cardinal = 'NW';
			break;
		case degree >= 326.25 && degree < 348.75:
			cardinal = 'NNW';
			break;
		default:
			cardinal = 'Error';
	}
	return cardinal;
}

// Capitalises the first letter of each word and adds a non-breaking space between words 0+1, 2+3 etc.
export function formatString(input: string): string {
	let split: string[] = input.split(' ');
	let formatted: string = '';
	for (let i: number = 0; i < split.length; i++) {
		if (i % 2 === 0) {
			formatted += split[i].charAt(0).toUpperCase() + split[i].slice(1) + '&nbsp;';
		} else {
			formatted += split[i].charAt(0).toUpperCase() + split[i].slice(1) + ' ';
		}
	}
	return formatted.trim();
}

export let forecast = writable<Forecast>({
	lat: 0,
	lon: 0,
	timezone: '',
	timezone_offset: 0,
	daily: []
});

export async function getForecast(lat: number, lon: number): Promise<void> {
	let res: Response = await fetch(
		`https://forecast.weather.callumhopkins.au/forecast?lat=${lat}&lon=${lon}`
	);
	let json: Forecast = await res.json();
	forecast.set(json);
}

let forecastDummyData: Forecast = {
	"lat": -37.7725,
	"lon": 145.2502,
	"timezone": "Australia/Melbourne",
	"timezone_offset": 39600,
	"daily": [
		{
			"dt": 1679277600,
			"sunrise": 1679257269,
			"sunset": 1679301137,
			"moonrise": 1679249100,
			"moonset": 1679299080,
			"moon_phase": 0.94,
			"temp": {
				"day": 20.14,
				"min": 11.56,
				"max": 21.25,
				"night": 11.56,
				"eve": 20,
				"morn": 13.37
			},
			"feels_like": {
				"day": 19.05,
				"night": 10.49,
				"eve": 19.07,
				"morn": 12.75
			},
			"pressure": 1025,
			"humidity": 32,
			"dew_point": 2.94,
			"wind_speed": 4.35,
			"wind_deg": 153,
			"wind_gust": 8.85,
			"weather": [
				{
					"id": 803,
					"main": "Clouds",
					"description": "broken clouds",
					"icon": "04d"
				}
			],
			"clouds": 59,
			"pop": 0,
			"uvi": 8.13
		},
		{
			"dt": 1679364000,
			"sunrise": 1679343724,
			"sunset": 1679387445,
			"moonrise": 1679340000,
			"moonset": 1679387220,
			"moon_phase": 0.97,
			"temp": {
				"day": 22.95,
				"min": 8.64,
				"max": 23.33,
				"night": 14.96,
				"eve": 15.93,
				"morn": 9.04
			},
			"feels_like": {
				"day": 22.37,
				"night": 14.99,
				"eve": 16.06,
				"morn": 9.04
			},
			"pressure": 1024,
			"humidity": 41,
			"dew_point": 9.26,
			"wind_speed": 2.18,
			"wind_deg": 33,
			"wind_gust": 4.55,
			"weather": [
				{
					"id": 501,
					"main": "Rain",
					"description": "moderate rain",
					"icon": "10d"
				}
			],
			"clouds": 100,
			"pop": 0.71,
			"rain": 2.8,
			"uvi": 4.2
		},
		{
			"dt": 1679450400,
			"sunrise": 1679430178,
			"sunset": 1679473753,
			"moonrise": 1679430780,
			"moonset": 1679475240,
			"moon_phase": 0,
			"temp": {
				"day": 22.02,
				"min": 14.07,
				"max": 23.43,
				"night": 14.07,
				"eve": 19.43,
				"morn": 14.73
			},
			"feels_like": {
				"day": 21.84,
				"night": 13.93,
				"eve": 19.13,
				"morn": 14.84
			},
			"pressure": 1019,
			"humidity": 60,
			"dew_point": 14.13,
			"wind_speed": 3.14,
			"wind_deg": 225,
			"wind_gust": 4.5,
			"weather": [
				{
					"id": 501,
					"main": "Rain",
					"description": "moderate rain",
					"icon": "10d"
				}
			],
			"clouds": 83,
			"pop": 0.94,
			"rain": 4.77,
			"uvi": 5.77
		},
		{
			"dt": 1679536800,
			"sunrise": 1679516633,
			"sunset": 1679560060,
			"moonrise": 1679521440,
			"moonset": 1679563260,
			"moon_phase": 0.05,
			"temp": {
				"day": 22.17,
				"min": 13.31,
				"max": 23.59,
				"night": 14.02,
				"eve": 18.8,
				"morn": 13.69
			},
			"feels_like": {
				"day": 21.96,
				"night": 13.91,
				"eve": 18.67,
				"morn": 13.57
			},
			"pressure": 1016,
			"humidity": 58,
			"dew_point": 13.58,
			"wind_speed": 2.81,
			"wind_deg": 197,
			"wind_gust": 4.97,
			"weather": [
				{
					"id": 500,
					"main": "Rain",
					"description": "light rain",
					"icon": "10d"
				}
			],
			"clouds": 100,
			"pop": 0.67,
			"rain": 0.76,
			"uvi": 5.95
		},
		{
			"dt": 1679623200,
			"sunrise": 1679603087,
			"sunset": 1679646368,
			"moonrise": 1679612100,
			"moonset": 1679651340,
			"moon_phase": 0.08,
			"temp": {
				"day": 20.99,
				"min": 11.95,
				"max": 21.69,
				"night": 11.95,
				"eve": 16.52,
				"morn": 14.18
			},
			"feels_like": {
				"day": 20.27,
				"night": 11.47,
				"eve": 15.82,
				"morn": 13.87
			},
			"pressure": 1021,
			"humidity": 43,
			"dew_point": 8.11,
			"wind_speed": 3.85,
			"wind_deg": 182,
			"wind_gust": 7.93,
			"weather": [
				{
					"id": 800,
					"main": "Clear",
					"description": "clear sky",
					"icon": "01d"
				}
			],
			"clouds": 0,
			"pop": 0,
			"uvi": 7.19
		},
		{
			"dt": 1679709600,
			"sunrise": 1679689542,
			"sunset": 1679732676,
			"moonrise": 1679702640,
			"moonset": 1679739600,
			"moon_phase": 0.12,
			"temp": {
				"day": 22.79,
				"min": 9.11,
				"max": 22.79,
				"night": 11.78,
				"eve": 14.25,
				"morn": 9.22
			},
			"feels_like": {
				"day": 22.3,
				"night": 11.44,
				"eve": 13.77,
				"morn": 9.22
			},
			"pressure": 1020,
			"humidity": 45,
			"dew_point": 10.42,
			"wind_speed": 3.33,
			"wind_deg": 217,
			"wind_gust": 5.3,
			"weather": [
				{
					"id": 802,
					"main": "Clouds",
					"description": "scattered clouds",
					"icon": "03d"
				}
			],
			"clouds": 27,
			"pop": 0,
			"uvi": 8
		},
		{
			"dt": 1679796000,
			"sunrise": 1679775996,
			"sunset": 1679818984,
			"moonrise": 1679793120,
			"moonset": 1679828100,
			"moon_phase": 0.15,
			"temp": {
				"day": 24.7,
				"min": 9.38,
				"max": 24.99,
				"night": 13.58,
				"eve": 15.95,
				"morn": 9.38
			},
			"feels_like": {
				"day": 24.06,
				"night": 12.93,
				"eve": 15.25,
				"morn": 9.38
			},
			"pressure": 1018,
			"humidity": 32,
			"dew_point": 7.31,
			"wind_speed": 2.43,
			"wind_deg": 227,
			"wind_gust": 1.98,
			"weather": [
				{
					"id": 800,
					"main": "Clear",
					"description": "clear sky",
					"icon": "01d"
				}
			],
			"clouds": 4,
			"pop": 0,
			"uvi": 8
		},
		{
			"dt": 1679882400,
			"sunrise": 1679862450,
			"sunset": 1679905292,
			"moonrise": 1679883420,
			"moonset": 1679916960,
			"moon_phase": 0.19,
			"temp": {
				"day": 28.16,
				"min": 13.03,
				"max": 28.16,
				"night": 20.95,
				"eve": 25.75,
				"morn": 14.97
			},
			"feels_like": {
				"day": 27.37,
				"night": 20.98,
				"eve": 25.45,
				"morn": 14.3
			},
			"pressure": 1011,
			"humidity": 33,
			"dew_point": 10.72,
			"wind_speed": 4.54,
			"wind_deg": 11,
			"wind_gust": 11.7,
			"weather": [
				{
					"id": 500,
					"main": "Rain",
					"description": "light rain",
					"icon": "10d"
				}
			],
			"clouds": 100,
			"pop": 0.49,
			"rain": 0.58,
			"uvi": 8
		}
	]
}
