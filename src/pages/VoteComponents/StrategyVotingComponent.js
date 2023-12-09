import React, { useState, useEffect } from 'react'
import protobuf from 'protobufjs'
import {
  useWaku,
  useContentPair,
  useLightPush,
  useStoreMessages,
  useFilterMessages
} from '@waku/react'
import { makeStyles } from '@mui/styles'
import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material'
import { Cancel, CheckCircle, ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    border: '10px solid #f9f9f9',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },

  summaryCardOther: {
    // backgroundColor: "#ffffff",
    // url(''), linear-gradient(#e89e66, #E57A26)
    background: 'linear-gradient(to bottom, #464646, #464646)',
    backgroundImage: `url(''), linear-gradient(#E5E4E2, #E5E4E2)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },
  summaryCard: {
    // backgroundColor: "#ffffff",

    background: 'linear-gradient(to bottom, #D72B66, #D72B66)',
    backgroundImage: `url(''), linear-gradient(#7A2C88, #5C6AC0)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 170,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },
  inputCard: {
    // backgroundColor: "#ffffff",
    backgroundColor: '#EEEFF3',
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },
  buttonConnect: {
    marginTop: 10,
    backgroundColor: '#0029FF',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.5625rem',
    width: '100%',
    height: 44,
    '&:hover': {
      backgroundColor: '#6385f3',
      color: 'white'
    }
  },
  select: {
    color: 'black',
    fontSize: 14,
    fontWeight: 600,
    border: 'none', // Remove the border
    borderRadius: 10, // Remove border-radius
    marginLeft: 10,
    marginRight: 10,
    padding: 4,
    paddingLeft: 10,
    background: '#DFE3E7' // Make the background transparent
  }
}))

const ChatMessage = new protobuf.Type('ChatMessage')
  .add(new protobuf.Field('timestamp', 1, 'uint64'))
  .add(new protobuf.Field('sender', 2, 'string'))
  .add(new protobuf.Field('message', 3, 'string'))

export default function StrategyVotingComponent(props) {
  const { node } = useWaku()
  const classes = useStyles()
  const theme = useTheme()
  const [nodeStart, setNodeStart] = useState(false)

  const [isVoted, setIsVotes] = useState(false)
  const [voteType, setVoteType] = useState(0)
  const [supportedVotes, setSupportedVotes] = useState(null)
  const [againstVotes, setAgainstVotes] = useState(null)

  const { decoder, encoder } = useContentPair()

  const { messages: storeMessages } = useStoreMessages({
    node,
    decoder
  })
  const { safeSelected } = useAccountAbstraction()
  let accountSC = safeSelected

  const { messages: filterMessages } = useFilterMessages({ node, decoder })

  const { push } = useLightPush({ node, encoder })

  async function sendMessage(sender, message) {
    const protoMessage = ChatMessage.create({
      timestamp: Date.now(),
      sender,
      message
    })

    const serialisedMessage = ChatMessage.encode(protoMessage).finish()

    const timestamp = new Date()
    await push({
      payload: serialisedMessage,
      timestamp
    })

    console.log('MESSAGE PUSHED')
  }

  function decodeMessage(wakuMessage) {
    if (!wakuMessage.payload) return

    const { timestamp, sender, message } = ChatMessage.decode(wakuMessage.payload)

    if (!timestamp || !sender || !message) return

    const time = new Date()
    time.setTime(Number(timestamp))

    return {
      message,
      timestamp: time,
      sender,
      timestampInt: wakuMessage.timestamp
    }
  }

  useEffect(() => {
    if (node !== undefined) {
      setNodeStart(true)
    }
  }, [node])

  useEffect(() => {
    let messages = storeMessages.concat(filterMessages)

    let tempSupport = []
    let tempAgainst = []

    messages = messages.map((message) => decodeMessage(message))
    console.log(messages)
    messages.forEach((message) => {
      if (message === undefined) {
        return
      }

      if (message.sender === accountSC) {
        setIsVotes(true)
        setVoteType(message.message)
      }
      if (message.message === '1') {
        let tempObj = {
          user: message.sender,
          message: message.message,
          timestamp: message.timestamp
        }
        tempSupport.push(tempObj)
      }

      if (message.message === '2') {
        let tempObj = {
          user: message.sender,
          message: message.message,
          timestamp: message.timestamp
        }
        tempAgainst.push(tempObj)
      }

      setSupportedVotes(tempSupport)
      setAgainstVotes(tempAgainst)
    })
  }, [storeMessages, filterMessages])

  const handleSupportStrategy = async () => {
    if (accountSC) {
      await sendMessage(accountSC, '1')
    }
  }
  const handleRejectStrategy = async () => {
    if (accountSC) {
      await sendMessage(accountSC, '2')
    }
  }

  return (
    <section id="room">
      <Typography
        variant="h2"
        fontSize={24}
        fontWeight={600}
        color={'#f9f9f9'}
        textAlign={'center'}
        mb={1}
      >
        Vote your upcoming strategy
      </Typography>
      {nodeStart && (
        <Box className={classes.summaryCard}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <img
              src={'https://i.ytimg.com/vi/-fnk_fDO2rw/maxresdefault.jpg'}
              height="240px"
              width="100%"
              style={{ borderRadius: 10 }}
            />
            <Typography
              variant="h2"
              fontSize={24}
              fontWeight={600}
              color={'#f9f9f9'}
              textAlign={'left'}
            >
              Governance: New strategy proposal - Buy the dip and sell the profit
            </Typography>
            <Typography
              variant="body2"
              fontSize={14}
              fontWeight={400}
              color={'#ffffff'}
              textAlign={'left'}
              my={1}
            >
              we are looking for votes to support or reject the new strategy to add in the platform
              which requires you to vote using Waku Communications
            </Typography>

            {voteType === '1' && (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <CheckCircle style={{ color: '#81c784' }} />
                <Typography
                  variant="h6"
                  fontSize={12}
                  fontWeight={600}
                  color={'#81c784'}
                  textAlign={'center'}
                >
                  SUPPORTED!
                </Typography>
              </Box>
            )}
            {voteType === '2' && (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Cancel style={{ color: 'red' }} />
                <Typography
                  variant="h6"
                  fontSize={12}
                  fontWeight={600}
                  color={'red'}
                  textAlign={'center'}
                >
                  REJECTED!
                </Typography>
              </Box>
            )}
            {isVoted && (
              <Typography
                variant="h6"
                fontSize={12}
                fontWeight={600}
                color={''}
                textAlign={'center'}
                mt={1}
              >
                Thanks for voting, You can now wait for the results!
              </Typography>
            )}
            <Box mt={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Box
                style={{ color: 'white' }}
                display={'flex'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                mr={2}
              >
                <Button
                  disabled={isVoted}
                  onClick={handleSupportStrategy}
                  style={{
                    marginTop: 10,
                    backgroundColor: isVoted ? '#bdbdbd' : '#f7931a',
                    color: isVoted ? '#454545' : 'black',
                    textDecoration: 'none',
                    borderRadius: '0.5625rem',
                    width: '100%',
                    height: 44
                  }}
                  mt={2}
                >
                  <ThumbUpAlt style={{ color: 'black' }} />
                  Support ({supportedVotes && supportedVotes.length})
                </Button>
              </Box>
              <Box
                style={{ color: 'white' }}
                display={'flex'}
                justifyContent={'flex-end'}
                alignItems={'center'}
                ml={2}
              >
                <Button
                  disabled={isVoted}
                  onClick={handleRejectStrategy}
                  style={{
                    marginTop: 10,
                    backgroundColor: isVoted ? '#bdbdbd' : '#f7931a',
                    color: isVoted ? '#454545' : 'black',
                    textDecoration: 'none',
                    borderRadius: '0.5625rem',
                    width: '100%',
                    height: 44
                  }}
                  mt={2}
                >
                  <ThumbDownAlt style={{ color: 'black' }} /> Reject (
                  {againstVotes && againstVotes.length})
                </Button>
              </Box>
            </Box>
          </Box>{' '}
          <Typography
            variant="body2"
            fontSize={12}
            fontWeight={500}
            color={'#E4E4E2'}
            textAlign={'center'}
            mt={1}
          >
            Voting will end in next 35 minutues
          </Typography>
        </Box>
      )}
      {!nodeStart && (
        <Box display="flex" justifyContent={'center'}>
          <CircularProgress />
        </Box>
      )}
    </section>
  )
}
