const data = "'eyJjcmVhdGVkQXQiOiIyMDIxLTAzLTE1VDE4OjAzOjA0LjYwN1oiLCJmZWVkYmFjayI6IkkgTG92ZSB5b3VyIGFwcC4gSXRzIGNvb2wiLCJjbGFzc2lmaWVkIjpmYWxzZSwiY2xhc3NpZmllZEF0IjoiMjAyMS0wMy0xNVQxODowMzowNC42MDdaIiwic2VudGltZW50U2NvcmUiOi0xLCJzZW50aW1lbnRNYW5nbml0dWRlIjotMX0=',";

const sampleMessage = {
    "message" :{
        "data" : "'eyJjcmVhdGVkQXQiOiIyMDIxLTAzLTE2VDAyOjQ3OjUxLjM3OVoiLCJmZWVkYmFjayI6IkkgTG92ZSB5b3VyIGFwcC4gSXRzIGNvb2wgYW5kIGhpcCIsImNsYXNzaWZpZWQiOmZhbHNlLCJjbGFzc2lmaWVkQXQiOiIyMDIxLTAzLTE2VDAyOjQ3OjUxLjM3OVoiLCJzZW50aW1lbnRTY29yZSI6LTEsInNlbnRpbWVudE1hbmduaXR1ZGUiOi0xLCJkb2NJZCI6IjVMc2N5Nnl3c1BCYzhtZ2tHOFJNIn0=',",
        "messageId": "37472346172347"
    }
}
const obj = JSON.parse(Buffer.from(data, 'base64').toString().trim());
obj.feedbackId = "hhhhhhhhhhhhhhhh";
console.log(obj);