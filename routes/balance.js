var express = require('express');
var router = express.Router();
var rn = require('random-number');
var horizonUrl = "https://horizon.stellar.org";
var getJSON = require('get-json');
var rndoptions = {
    min:  1000
    , max:  10000
    , integer: true
};
var cache = require('memory-cache');
const PRICE_UP   = 'a858';
const PRICE_DOWN = 'a11225';
const STELLAR = "i15391";
router.get('/:accountid', function(req, res, next) {

   getJSON(horizonUrl + "/accounts/" + req.params.accountid, function(error, response){
        if(error){
           res.status(400).send("Invalid account Id");
        } else {
            getUsdPrice(function(usd){
                var prevValue = cache.get(req.params.accountid);
                if(!prevValue){
                    prevValue = 0;
                }
                var newValue = response.balances[0].balance;
                //var newValue = rn(rndoptions);
                var changedValue = newValue - prevValue;
                var changedPercentage = 0;
                if(prevValue !== 0) {
                    changedPercentage = (changedValue) / prevValue * 100;
                }
                cache.put(req.params.accountid, newValue);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    frames: [
                        {
                            text: "Wallet",
                            icon: STELLAR,
                            index: 0
                        },
                        {
                            text: parseInt(newValue) + " XLM",
                            icon: STELLAR,
                            index: 1
                        },
                        {
                            text: parseInt(newValue * usd) + " $",
                            icon: STELLAR,
                            index: 2
                        },
                        {
                            text: (changedPercentage > 0 ? '+' : '') + changedPercentage.toFixed(2) + '%',
                            icon: (changedPercentage > 0 ? PRICE_UP : PRICE_DOWN),
                            index: 3
                        }
                    ]
                }, null, 3));
            });

        }
    });
});

getUsdPrice = function(callback) {
    getJSON("https://coincap.io/front", function(error, response){
        for(var i = 0; i < response.length;i++){
            if(response[i].short === "XLM"){
                callback(response[i].price);
            }
        }
    });
};
module.exports = router;
