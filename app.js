
const express = require("express");
const bodyparser = require("body-parser")
let candlelist = [];
const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
let access_token = " ";
let auth = " ";


app.listen(8080, function () {
    console.log("Hello");
})

const fyers = require("fyers-api-v2");
const { setAccessToken } = require("fyers-api-v2");
fyers.setAppId('6B589PEK0X-100')
fyers.setRedirectUrl('http://localhost:8080/auth');
/*auth_code : “This will be the response of the generateAuthCode method once you click 
on the redirect_url you will be provided with the auth_code”*/
fyers.generateAuthCode();

const url = "https://api.fyers.in/api/v2/generate-authcode?client_id=6B589PEK0X-100&redirect_uri=http://localhost:8080/auth&response_type=code&state=sample_state"




app.get("/home", function (req, res) {
    res.render("fyers",{candles:candlelist});
    candlelist=[]
})
app.get("/", function (req, res) {
    res.redirect(url);
})
app.post("/home", function (req, res) {
    let stockname = req.body.sn;
    let timeframe = req.body.tf;
    let startdate = req.body.dr1;
    let lastdate = req.body.dr2;
    console.log(timeframe)
    if (timeframe === "1 day") {
        timeframe = "D";
    }
    else {
        timeframe = timeframe.split(" ");
        timeframe = timeframe[0];
    }
    console.log(timeframe)


    console.log(stockname, timeframe, startdate, lastdate);
    async function getHistory() {
        let history = new fyers.history()
        let result = await history.setSymbol(stockname)
            .setResolution(timeframe)
            .setDateFormat(1)
            .setRangeFrom(startdate)
            .setRangeTo(lastdate)
            .getHistory()
      

        const candlearray=result.candles;
        candlelist=Object.values(candlearray)
        res.redirect("/home");
    }  
    
        getHistory();



    })


app.get("/auth", function (req, res) {


    res.redirect("/home");
    auth = req.query.auth_code;
    console.log(auth)

    const reqBody = {
        auth_code: auth,
        secret_key: "ANFHLLWORI"
    }
    fyers.generate_access_token(reqBody).then((response) => {

        console.log(response)

        access_token = response.access_token;
        fyers.setAccessToken(access_token);

    });
});
