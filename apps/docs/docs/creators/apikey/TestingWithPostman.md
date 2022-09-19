---
title: API key with Postman
description: This is where you will find information on how to use your API key with Postman.
hide_table_of_contents: false
sidebar_position: 4
---

## Testing with Postman

One way of testing is to use an API testing platform like Postman. Once you have installed and opened postman and have arrived at the main dashboard you will see a little plus symbol and the top left just below the main tool bar that looks like this:

> ![New Tab Icon](/img/apikey/postman-new-tab.png)

Click it to open a new tab where you will see a field to put your spells URL.

> ![Url Input](/img/apikey/postman-url-input.png)

Make sure that your your request type is set to POST.

> ![Request type](/img/apikey/postman-request-type.png)

Click on the Authorization tab below the request url input and set the type field to API key.

> ![Authorization tab](/img/apikey/postman-authorization-tab.png)

Then under the Key value write `x-api-key`

> ![Key field](/img/apikey/postman-key.png)

Paste your generated API key into the value field.

> ![Value field](/img/apikey/postman-apikey-input.png)

Set the 'Add to' field to Header.

> ![Add to field](/img/apikey/postman-add-to-header.png)

Now click on the Body tab and Select form-data.

> ![Body screen](/img/apikey/postman-body-input.png)

Now here we have to pay attention. Your key value must be the exact name of the first input that your spell is expecting. If your input is called 'input' then you would write 'input' into the key field. If your inputs name is 'myAmazingInputName' then you guessed it, you would write 'myAmazingInputName' as your key value here. In the value field you can write anything to test and see what happens. Your spell expects an input of somthing so make sure to provide some kind of value here.

Finally Click Send!

> ![Send](/img/apikey/postman-send.png)

At the bottom of that page you will get a response. If successfull you should see your expected output. If there is an error, hopefully its an error that can give you more information about what failed in your spell.

---
