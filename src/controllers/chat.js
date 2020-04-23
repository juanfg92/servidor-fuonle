'use strict'

const Chat = require('../models/chat')

/**
 * new chat
 * @param {*} req 
 * @param {*} res 
 */
async function newChat(req, res) {
    // Check empty camps
    if (req.body.userId1 == null ||
        req.body.userId1 == "" ||
        req.body.userId2 == null ||
        req.body.userId2 == "") {
        return res.status(500).send({ message: `Error creating the chat: empty camps` })
    }

    // Save chat
    let chat = new Chat({
        _id_user1: req.body.userId1,
        _id_user2: req.body.userId2
    })

    chat.save((err, chat) => {
        if (err) res.status(500).send({ message: `Error creating the chat: ${err}` })
        return res.status(200).send({ chat: chat });
    })
}

/**
 * get chat from two users
 * @param {*} req 
 * @param {*} res 
 */
async function getChat(req, res) {
    let userId = req.body.userId

    Chat.find({ _id_user1: userId }, (err, chat) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!chat[0]) {
            Chat.find({ _id_user2: userId }, (err, chat) => {
                if (err) return res.status(500).send({ message: `Error server: ${err}` })
                if (!chat[0]) return res.status(200).send(false)
                if (chat[0]) return res.status(200).send({ Chat: chat })
            })
        } else {
            return res.status(200).send({ Chat: chat })
        }
    })
}

/**
 * delete chat
 * @param {*} req 
 * @param {*} res 
 */
function deleteChat(req, res) {
    Chat.findByIdAndRemove(req.body.chatId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `chat ${req.body.chatId} has been deleted` })
    })
}

module.exports = {
    newChat,
    getChat,
    deleteChat
}