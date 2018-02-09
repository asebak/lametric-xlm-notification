var express = require('express');
var router = express.Router();
var rn = require('random-number');
var horizonUrl = "https://horizon.stellar.org";
var getJSON = require('get-json');
var rndoptions = {
    min:  1000
    , max:  10000
    , integer: true
}
router.get('/', function(req, res, next) {

    getJSON(horizonUrl + "/accounts/" + req.query.accountid, function(error, response){
       // if(error){
       //     res.status(400).send("Invalid account Id");
      //  } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                frames: [
                    {
                        text: "Wallet",
                        icon: "i15391"
                    },
                    {
                        text: rn(rndoptions),
                        icon: "i15391"
                    }
                ]
            }, null, 3));
        //}
        //                        text: response.balances[0].balance,

    });
});

module.exports = router;
