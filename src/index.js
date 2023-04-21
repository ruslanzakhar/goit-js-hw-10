import './css/styles.css';
import debounce from "lodash.debounce";
import fetchCountries from "./fetchCountries";
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 1000;
let name = "";

const inputEl = document.getElementById(`search-box`);
inputEl.addEventListener(`input`, debounce(onInputChange, DEBOUNCE_DELAY,{
    leading: false,
    trailing: true,
  }));
const countryInfo = document.querySelector(`.country-info`);
const countrylist = document.querySelector(`.country-list`);


function onInputChange (e){
    e.preventDefault();
    name = e.target.value.trim();
    clearHTML ();

    if(!name){
        Notiflix.Notify.warning('please enter a query');
        return;
    }

    fetchCountries(name).then(data => {
        if(data.length > 10){
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }else if(data.length > 2 && data.length < 10) {
            countrylist.innerHTML = makeCountryList(data);
        }else if(data.length === 1){
            countryInfo.innerHTML = makeCountryinfo(data);
        }else if(data.status === 404){
            console.log(data)
            Notiflix.Notify.failure("Oops, there is no country with that name");
        }
        })
        .catch(error =>{error});

    }

   
    
    
    function makeCountryList(data){
        return data.map(({name, flags}) =>`<li class = "country-cards">
        <img src="${flags.png}" alt="${name.official}" width="50" height ="30">
        <h2 class = "title">${name.official}</h2></li>`).join(``);
    }

    function makeCountryinfo(data){
        return data.map(({name, flags, capital, population, languages}) =>`<div class = "country-card">
        <img src="${flags.png}" alt="${name.official}" width="100" height ="50">
        <h2 class = "country-card-title">${name.official}</h2>
        <p class="subtitle"><b>Capital:</b>${capital}</p>
        <p class="subtitle"><b>Population:</b>${population}</p>
        <p class="subtitle"><b>Languages:</b>${Object.values(languages)}</p>
        </div>`).join(``);
        
    }

    function clearHTML (){
        countryInfo.innerHTML ="";
        countrylist.innerHTML ="";
    }