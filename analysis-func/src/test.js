const data = "'eyJjcmVhdGVkQXQiOiIyMDIxLTAzLTE1VDE4OjAzOjA0LjYwN1oiLCJmZWVkYmFjayI6IkkgTG92ZSB5b3VyIGFwcC4gSXRzIGNvb2wiLCJjbGFzc2lmaWVkIjpmYWxzZSwiY2xhc3NpZmllZEF0IjoiMjAyMS0wMy0xNVQxODowMzowNC42MDdaIiwic2VudGltZW50U2NvcmUiOi0xLCJzZW50aW1lbnRNYW5nbml0dWRlIjotMX0=',";

const obj = JSON.parse(Buffer.from(data, 'base64').toString().trim());
obj.feedbackId = "hhhhhhhhhhhhhhhh";
console.log(obj);