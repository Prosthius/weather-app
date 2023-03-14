<script lang="ts">
    import { PUBLIC_API_KEY as apiKey} from '$env/static/public';
    
    let cityName: string = 'Melbourne';
    let locationCoords: any;
    let currentWeather: any;

    async function getCurrentWeather() {
        await getLocation(cityName);
        let res: any = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationCoords.lat}&lon=${locationCoords.lon}&units=metric&appid=${apiKey}`)
        let json: any = await res.json();
        currentWeather = json;
        console.log(currentWeather)
    }

    async function getLocation(city: string) {
        let res: any = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=Melbourne,AU&limit=1&appid=${apiKey}`);
        let json: any = await res.json();
        locationCoords = json[0];
    }
</script>

{#await getCurrentWeather()}
    <h1>CurrentWeather</h1>
{:then locationCoords}
    <h1>{currentWeather.main.temp}</h1>
{:catch error}
    <h1>Error: {error.message}</h1>
{/await}