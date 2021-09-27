"use strict";

const line = require("@line/bot-sdk");
const express = require("express");

// create LINE SDK config from env variables
const config = {
  channelAccessToken:
    "po1RDavhWO0AfV302GEPnVd/In+NapsGWDcap6zO/kkNsDuAfrz2FhbpADoAE4ZojsS4F9z7BmZPCEroSPBNXoDcEsltzWt+KtIBI3mpVRQID5lsmCt1gWatNq16S5v1/ElXqOglzs2IW4qCAF57oAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "5223fb4a9301852d9693c6241fc26263",
};

const client = new line.Client(config);

const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: "text", text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
