'use strict'

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
    if (req.body.text.length > 512 || req.body.description.length < 0) return res.status(400).send({ message: `the message must be between 1 and 512 characters` });

    // Save message
    let message = new Message({
        _id_chat: chatId,
        _id_transmitter: req.body.userId,
        _id_receiver: req.body.documentId,
        text: req.body.description
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
    Message.find({ _id_chat: req.body.chatId, _id_transmitter: transmitterId, _id_receiver: receiverId, received: false }, (err, messages) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (messages.length == 0) return res.status(404).send(false)
        res.status(200).send({ Messages: messages.length })
    })
}

/**
 * send messages read between two users
 * @param {*} req 
 * @param {*} res 
 */
async function downloadMessagesRead(req, res) {
    Message.find({ _id_chat: req.body.chatId, _id_transmitter: transmitter, _id_receiver: req.body.userId, received: true }).sort('-date').exec(function(err, messages) {
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
    Message.find({ _id_chat: req.body.chatId, _id_transmitter: transmitter, _id_receiver: req.body.userId, received: false }).sort('-date').exec(function(err, messages) {
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
    req.body.message.forEach(msg => {
        msg.received = true
        Message.findOneAndUpdate({ _id: msg.id }, msg, (err) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
        })
    })
    res.status(200).send({ Messages: `updated messages` })
}

module.exports = {
    sendMessage,
    checkMessages,
    downloadMessagesRead,
    downloadMessagesUnread,
    messagesReceived
}