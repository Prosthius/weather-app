import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Forecast } from './interfaces/Forecast';
import type { CurrentWeather } from './interfaces/CurrentWeather';
import type { LocationCoords } from './interfaces/LocationCoords';

export let locationCoords: Writable<LocationCoords> = writable<LocationCoords>({
    lat: -37.8142,
    lon: 144.9632
});

const mockForecast: Forecast = {
    lat: 0,
    lon: 0,
    timezone: '',
    timezone_offset: 0,
    daily: []
};

export const mockCurrentWeather: CurrentWeather = {
    coord: {
        lon: 0,
        lat: 0,
    },
    weather: [{
        id: 0,
        main: '',
        description: '',
        icon: '',
    }],
    base: '',
    main: {
        temp: 0,
        feels_like: 0,
        temp_min: 0,
        temp_max: 0,
        pressure: 0,
        humidity: 0,
    },
    wind: {
        speed: 0,
        deg: 0,
    },
    clouds: {
        all: 0,
    },
    dt: 0,
    sys: {
        type: 0,
        id: 0,
        country: '',
        sunrise: 0,
        sunset: 0,
    },
    timezone: 0,
    id: 0,
    name: '',
    cod: 0,
};

export let forecast: Writable<Forecast> = writable<Forecast>(mockForecast);

export async function getForecast(lat: number, lon: number): Promise<void> {
    let res: Response = await fetch(
        `https://forecast.weather.callumhopkins.au/forecast?lat=${lat}&lon=${lon}`
    );
    let json: Forecast = await res.json();
    forecast.set(json);
}

export let currentWeather: Writable<CurrentWeather> = writable<CurrentWeather>(mockCurrentWeather);

export async function getCurrentWeather(lat: number, lon: number): Promise<void> {
    currentWeather.set(mockCurrentWeather);
    let res: Response = await fetch(
        `https://current.weather.callumhopkins.au/weather?lat=${lat}&lon=${lon}`
    );
    let json: CurrentWeather = await res.json();
    currentWeather.set(json);
}