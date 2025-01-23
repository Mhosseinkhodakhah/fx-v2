import express from 'express'
import mqConnection from "./eventConnection";
import connection from './DB/connection';


connection()


const send = async () => {

    const newNotification = {
        title: "You have received new notification",
        description:
            "You have received new incmoing notification from the producer service",
    };

    await mqConnection.sendToQueue('tracer', newNotification)
    console.log('the message send to signal . . .')

};


setInterval(async () => {
    await send()
}, 1000)