const formResponse = (message, res) => {
    res.status(message?.status ?? 200).send(message ?? message)
}

module.exports = formResponse