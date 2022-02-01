import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import { useRouter } from 'next/router'
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'

import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM3ODY2MSwiZXhwIjoxOTU4OTU0NjYxfQ.7anjDYIyHr7cDm9wiRVbTZOt4dholvtk3xQq51UafLQ'
const SUPABASE_URL = 'https://ptvcpnxgxrjgfyjqqhfp.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function listenerMessage(addMessage) {
    return supabaseClient.from('messages')
        .on('INSERT', (response) => {
            addMessage(response.new)
        })
        .subscribe()
}

export default function ChatPage() {
    const router = useRouter()
    const username = router.query.username

    const [message, setMessage] = React.useState('')
    const [messageList, setMessageList] = React.useState([])

    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(true)
        supabaseClient.from('messages').select('*').order('id', { ascending: false })
            .then(({ data }) => {
                //console.log('Dados', data)
                setMessageList(data)
            })
        listenerMessage((newMessage) => {
            setMessageList((currentValue) => {
                return [
                    newMessage,
                    ...currentValue
                ]
            })
        })

        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }, [])

    function handleSendMessage(newMessage) {
        const message = {
            //id: messageList.length + 1,
            of: username,
            text: newMessage
        }

        supabaseClient.from('messages')
            .insert([message])
            .then(() => {
                //console.log("Mensagem", data)
                //setMessageList([data[0], ...messageList])

            })

        setMessage('')
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                //backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/07/earthrise-1536x864.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',

                }}
            >
                <Header />
                {
                    loading ?
                        <Box
                            styleSheet={{
                                display: 'flex',
                                margin: 'auto',
                                padding: 'auto',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ClimbingBoxLoader
                                color={"#50E3C2"}
                            >
                            </ClimbingBoxLoader>
                        </Box>
                        :
                        <Box
                            styleSheet={{
                                position: 'relative',
                                display: 'flex',
                                flex: 1,
                                height: '80%',
                                backgroundColor: appConfig.theme.colors.neutrals[600],
                                flexDirection: 'column',
                                borderRadius: '5px',
                                padding: '16px',
                            }}
                        >

                            <MessageList messageList={messageList} />
                            {/* Lista de mensagens: {messageList.map(message => {
                        return (
                            <li key={message.id}>
                                {message.of}: {message.text}
                            </li>
                        )
                    })} */}
                            <Box
                                as="form"
                                styleSheet={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            let newMessage = message
                                            newMessage = newMessage.trim()
                                            if (newMessage !== '' && newMessage.length > 0) {
                                                handleSendMessage(newMessage)
                                            }
                                        }
                                    }}
                                    placeholder="Insira sua mensagem aqui..."
                                    type="textarea"
                                    styleSheet={{
                                        width: '100%',
                                        border: '0',
                                        resize: 'none',
                                        borderRadius: '5px',
                                        padding: '6px 8px',
                                        backgroundColor: appConfig.theme.colors.neutrals[800],
                                        marginRight: '12px',
                                        color: appConfig.theme.colors.neutrals[200],
                                    }}
                                />
                                <Box
                                    styleSheet={{
                                        display: 'flex',
                                        width: 'auto',
                                        marginRight: '12px'

                                    }}
                                >
                                    <ButtonSendSticker
                                        onStickerClick={(sticker) => {
                                            handleSendMessage(`:sticker: ${sticker}`)
                                        }}
                                    />

                                    <Button
                                        //type='submit'
                                        //label='Enviar'
                                        iconName="FaTelegram"
                                        rounded="none"
                                        buttonColors={{
                                            contrastColor: `${appConfig.theme.colors.primary[500]}`,
                                            mainColor: `${appConfig.theme.colors.neutrals[800]}`,
                                            mainColorLight: `${appConfig.theme.colors.neutrals[600]}`,
                                            mainColorStrong: `${appConfig.theme.colors.neutrals[900]}`
                                        }}
                                        styleSheet={{
                                            borderRadius: '50%',
                                            padding: '0 3px 0 0',
                                            minWidth: '50px',
                                            minHeight: '50px',
                                            fontSize: '20px',
                                            margin: '0 8px',
                                            lineHeight: '0',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            let newMessage = message
                                            newMessage = newMessage.trim()
                                            if (newMessage !== '' && newMessage.length > 0) {
                                                handleSendMessage(newMessage)
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                }

            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    //console.log('MessageList', props)
    const userAnonymous = "https://png.pngtree.com/png-clipart/20200701/original/pngtree-hacker-coding-with-a-keyboard-and-a-binary-background-color-illustration-png-image_5426760.jpg"

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {
                props.messageList.map((message) => {
                    return (
                        <Text
                            key={message.id}
                            tag="li"
                            styleSheet={{
                                borderRadius: '5px',
                                padding: '6px',
                                marginBottom: '12px',
                                hover: {
                                    backgroundColor: appConfig.theme.colors.neutrals[700],
                                }
                            }}
                        >
                            <Box
                                styleSheet={{
                                    marginBottom: '8px',
                                }}
                            >
                                <Image
                                    styleSheet={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                    }}
                                    src={message.of ? `https://github.com/${message.of}.png` : userAnonymous}
                                />
                                <Text tag="strong">
                                    {message.of ? message.of : "Anônimo"}
                                </Text>
                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.neutrals[300],
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                            </Box>
                            <Text
                                styleSheet={{
                                    fontSize: '14px',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {message.text.startsWith(':sticker:')
                                    ? (<Image styleSheet={{ maxWidth: '7rem' }} src={message.text.replace(':sticker:', '')} />)
                                    : (message.text)}
                            </Text>
                        </Text>
                    )
                })
            }

        </Box>
    )
}