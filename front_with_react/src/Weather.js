import './App.css';
import { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';


const Weather = () => {
    const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
    let [weather, setWeather] = useState("");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            getWeather(lat, lon);
        });
    },[])  // 처음 렌더링 시에 경도와 위도를 받아와 getWeather function을 호출
    
    const getWeather = async (lat, lon) => {   
        try {
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            );
            const weatherId = res.data.weather[0].id;
            const weatherIcon = res.data.weather[0].icon;
            const weatherIconAddr = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            const temp = Math.round(res.data.main.temp);
            const status = res.data.weather[0].main;

            setWeather({
                name: res.data.name,
                temp: temp,
                icon: weatherIconAddr,
                status : status,
            })
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <div className='weatherWrapper'>
                <div className='provinceBox'>
                    {weather.name}
                </div>
                <div className='todayTempBox'>
                    {parseInt(weather.temp - 273.15)}°C
                    
                </div>
                <div className='weatherImgBox'>
                    {weather.status}
                </div>
                <div><img src={weather.icon}/></div>
            </div>
        </div>
    )


}

export default Weather;