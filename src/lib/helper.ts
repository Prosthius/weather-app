import type { Forecast } from './interfaces';

export function unixToLocaleTime(unixUTC: number) {
	let date = new Date(unixUTC * 1000);
	return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function unixToLocaleDay(unixUTC: number) {
	let date = new Date(unixUTC * 1000);
	return date.toLocaleDateString(undefined, { weekday: 'long' });
}

export function unixToLocaleDate(unixUTC: number) {
	let date = new Date(unixUTC * 1000);
	return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

export function degreeToCardinal(degree: number) {
	let cardinal;
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

export function formatString(input: string) {
	let split = input.split(' ');
	let capitalised = split.map((word: any) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return capitalised.join('&nbsp;');
}

export let forecast: Forecast;
export async function getWeather(lat: number, lon: number): Promise<Forecast> {
	let res: any = await fetch(
		`https://forecast.weather.callumhopkins.au/forecast?lat=${lat}&lon=${lon}`
	);
	let json: any = await res.json();
	forecast = json;
	return forecast;
}
