'use strict'

/**
 * 1º descargar mensajes con downloadMessages
 * 2º comprobar que el receptor de los mensajes no haya leido los mensajes con checkMessages
 * 3º cuando el receptor haya leido los mensajes con receive == false, los convertimos en true para que no salga mas la notificacion de esos mensajes con messagesReceived(msgId)
 * 4º con la libreria de observables y downloadMessagesUnread comprobamos que no haya mensajes en tiempo real
 */

const Message = require('../models/message')

/**
 * send message
 * @param {*} req 
 * @param {*} res 
 */
async function sendMessage(req, res) {
    // Check empty camps
    if (req.body.chatId == null ||
        req.body.chatId == "" ||
        req.body.transmitterId == null ||
        req.body.transmitterId == "" ||
        req.body.receiverId == null ||
        req.body.receiverId == "" ||
        req.body.text == null ||
        req.body.text == "") {
        return res.status(500).send({ message: `Error creating the message: empty camps` })
    }

    // message validation 
    if (req.body.text.length > 512 || req.body.text.length < 0) return res.status(400).send({ message: `the message must be between 1 and 512 characters` });

    // Save message
    let message = new Message({
        _id_chat: req.body.chatId,
        _id_transmitter: req.body.transmitterId,
        _id_receiver: req.body.receiverId,
        text: req.body.text
    })

    message.save((err, message) => {
        if (err) res.status(500).send({ message: `Error creating the message: ${err}` })
        return res.status(200).send({ Message: message });
    })
}

/**
 * check for unread messages from a user
 * @param {*} req 
 * @param {*} res 
 */
async function checkMessages(req, res) {
    Message.find({ _id_chat: req.body.chatId, received: false }, (err, messages) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (messages[0]._id_receiver == req.body.transmitterId) {
            res.status(200).send({ Messages: messages.length })
        } else {
            return res.status(404).send(false)
        }
    })
}

/**
 * send messages read between two users
 * @param {*} req 
 * @param {*} res 
 */
async function downloadMessages(req, res) {
    Message.find({ _id_chat: req.body.chatId }).sort('-date').exec(function(err, messages) {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        res.status(200).send({ Messages: messages })
    })
}

/**
 * send unread messages between two users
 * @param {*} req 
 * @param {*} res 
 */
async function downloadMessagesUnread(req, res) {
    Message.find({ _id_chat: req.body.chatId, received: false }).sort('-date').exec(function(err, messages) {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        res.status(200).send({ Messages: messages })
    })
}

/**
 * update messages received: true
 * @param {*} req 
 * @param {*} res 
 */
async function messagesReceived(req, res) {
    Message.findOne({ _id: req.body.messageId }, (err, msg) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        msg.received = true
        Message.findOneAndUpdate({ _id: msg._id }, msg, (err) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            res.status(200).send({ Messages: `updated messages` })
        })
    })




}

module.exports = {
    sendMessage,
    checkMessages,
    downloadMessages,
    downloadMessagesUnread,
    messagesReceived
}