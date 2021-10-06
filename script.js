function init(){ 
    checkCookie()
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=Gavle&units=metric&appid=ac9ae631e212116f1ae5ae8d3b2969ef')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        //Filling the sidebar with elements
        let gavle = document.getElementById("gavleInfo")
        //Place
        let tag = document.createElement("h5")
        let value = document.createTextNode(data.city.name+"(now)")
        tag.appendChild(value)
        gavle.appendChild(tag)
        //Temp
        tag = document.createElement("p")
        value = document.createTextNode(Math.round(data.list[0].main.temp)+"\xB0")
        tag.appendChild(value)
        gavle.appendChild(tag)
        //Date and time
        tag = document.createElement("p")
        value = document.createTextNode(data.list[0].dt_txt)
        tag.appendChild(value)
        gavle.appendChild(tag)
        //Add more details button and eventlistener
        tag = document.createElement("button")  
        tag.id = "moreDetails";
        tag.innerHTML = "More details";
        gavle.appendChild(tag) 
        tag.addEventListener("click", function(event){
            tag.hidden = true;
            //Humidity
            tag = document.createElement("p")
            value = document.createTextNode("Humidity: "+data.list[0].main.humidity+"%")
            tag.appendChild(value)
            gavle.appendChild(tag)
            //Wind
            tag = document.createElement("p")
            value = document.createTextNode("Wind: "+data.list[0].wind.speed+" m/s")
            tag.appendChild(value)
            gavle.appendChild(tag)
            //rain
            try {
                tag = document.createElement("p")
                value = document.createTextNode("Rain past 3h: "+data.list[0].rain['3h']+"mm")
                tag.appendChild(value)
                gavle.appendChild(tag)
            } catch (error) {} 
            //5 day prognosis
            for (let index = 8; index <= 32; index+=8) {
                tag = document.createElement("P")
                value = document.createTextNode(Math.round(data.list[index].main.temp)+"\xB0")
                tag.appendChild(value)
                if(index > 15){
                    tag.appendChild(document.createTextNode(" "+(index*3/24)+" days from now"))
                }
                else{
                    tag.appendChild(document.createTextNode(" Tomorrow"))
                }
                gavle.appendChild(tag)
            }    
        })        
    })

    //Add event listener to the enter key while on the searchbar.
    var input = document.getElementById("SearchBar");
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            let txtCity = input.value;
            search(txtCity);
        }
    })
}
function search(aCity){
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ aCity +'&units=metric&appid=ac9ae631e212116f1ae5ae8d3b2969ef')
    .then(response => response.json())
    .then(data => {
        let div = document.getElementById("searchResults")
        div.innerHTML = '';
        //Place
        let tag = document.createElement("h5")
        let value = document.createTextNode(data.city.name)
        tag.appendChild(value)
        div.appendChild(tag)
        //Current temp
        let smalldiv = document.createElement("div")
        tag = document.createElement("p")
        value = document.createTextNode("Now")
        tag.appendChild(value)
        smalldiv.appendChild(tag)
        tag = document.createElement("p")
        value = document.createTextNode(Math.round(data.list[0].main.temp)+"\xB0")
        tag.appendChild(value)
        smalldiv.appendChild(tag)
        tag = document.createElement("img") 
        tag.src = "http://openweathermap.org/img/wn/"+data.list[0].weather[0].icon+"@2x.png"
        tag.alt = data.list[0].weather[0].description
        smalldiv.appendChild(tag)
        tag = document.createElement("p")
        tag.innerHTML = data.list[0].weather[0].description
        smalldiv.appendChild(tag)
        smalldiv.style.border = "1px solid";
        div.appendChild(smalldiv)
        //Printing weather data for every 24h
        for (let index = 8; index <= 32; index+=8) {
            smalldiv = document.createElement("div")
            tag = document.createElement("p")
            if(index > 15)
                value = document.createTextNode((index*3/24)+" days from now")
            else
                value = document.createTextNode("Tomorrow")
            tag.appendChild(value)
            smalldiv.appendChild(tag)
            tag = document.createElement("p")
            value = document.createTextNode(Math.round(data.list[index].main.temp)+"\xB0")
            tag.appendChild(value)
            smalldiv.appendChild(tag)
            tag = document.createElement("img") 
            tag.src = "http://openweathermap.org/img/wn/"+data.list[index].weather[0].icon+"@2x.png"
            tag.alt = data.list[index].weather[0].description
            smalldiv.appendChild(tag)
            tag = document.createElement("p")
            tag.innerHTML = data.list[index].weather[0].description
            smalldiv.appendChild(tag)
            smalldiv.style.border = "1px solid";
            div.appendChild(smalldiv)
        }
        //Canvas element showing humidity
        smalldiv = document.createElement("div")
        tag = document.createElement("p")
        value = document.createTextNode("Humidity(%) past 5 days")
        tag.appendChild(value)
        smalldiv.appendChild(tag)
        tag = document.createElement("canvas")
        tag.id = "myCanvas";
        tag.height = 200;
        tag.width = 380;
        smalldiv.appendChild(tag)
        div.appendChild(smalldiv)
        let ctx = tag.getContext("2d");
        let Xcounter = 10;
        ctx.moveTo(0, tag.height-(data.list[0].main.humidity*2));
        for (let index = 1; index <= 39; index++) {
            ctx.lineTo(Xcounter, tag.height-(data.list[index].main.humidity*2));
            ctx.stroke();
            Xcounter += 10;
        }
        //Saves input into a cookie and also prints it into the correct place
        setCookie("lastresult", aCity, 30)
        checkCookie();
    })
    .catch(err => {
        let div = document.getElementById("searchResults")
        div.innerHTML = "- No city by that name -";
    })
    
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function checkCookie() {
    let result = getCookie("lastresult");
    if (result != "") {
        let div = document.getElementById("latestSearches")
        div.innerHTML = "";
        let headline = document.createElement("h5")
        headline.innerHTML = "Last search";
        div.appendChild(headline)
        let link = document.createElement("a")
        link.addEventListener("click", function(event){
            search(result)
        })
        link.innerHTML = result
        div.appendChild(link)
    }
  }