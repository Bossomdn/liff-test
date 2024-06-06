const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

require('dotenv').config()

const PORT = '8888'
const LINE_BOT_API = 'https://api.line.me/v2/bot'
const line_channel_access_token = process.env.line_channel_access_token

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${line_channel_access_token}`
}

app.post('/send-message', async (req, res) => {
    try {
        const { userId, message } = req.body

        if (!userId || !message) {
            return res.status(400).json({ error: 'userId and message are required' })
        }

        const body = {
            to: userId,
            messages: [
                {
                    type: "text",
                    text: message
                }
            ]
        }

        console.log('Request Body:', body)
        console.log('Request Headers:', headers)

        const response = await axios.post(
            `${LINE_BOT_API}/message/push`,
            body,
            { headers }
        )

        console.log('response', response.data)

        res.json({
            message: 'Send message success',
            responseData: response.data
        })
    } catch (error) {
        console.log('Error Data:', error.response ? error.response.data : error.message)
        console.log('Error Status:', error.response ? error.response.status : 'No response status')
        console.log('Error Headers:', error.response ? error.response.headers : 'No response headers')
        res.status(500).json({
            error: error.response ? error.response.data : 'Internal Server Error'
        })
    }
})

app.listen(PORT, () => {
    console.log(`run at http://localhost:${PORT}`)
})
