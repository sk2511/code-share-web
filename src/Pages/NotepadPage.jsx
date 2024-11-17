import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react'
import styled from 'styled-components'
import NotepadNavbar from '../Components/NotepadNavbar'
import SideNavbar from '../Components/SideNavbar'
import { useNavigate, useParams } from 'react-router-dom'
import VideoCall from '../Components/VideoCall'
import { SocketContext } from '../Components/SocketContext'

import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import moment from 'moment'
import { useToast } from '../Components/Toast/ToastContex'
import debounce from 'lodash.debounce'
import { axiosGet, axiosPost } from '../Services/apiServices'

const Textarea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  caret-color: #fff;
  line-height: 15pt;
  bottom: 0;
  color: transparent;
  background: transparent;
  z-index: 10;
`

const CodePadDiv = styled.div`
  color: #999;
  line-height: 15pt;
  white-space: pre-wrap;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  overflow-y: hidden;
  z-index: 0;
`

export default function NotepadPage() {
  const [textAreaValue, setTextAreaValue] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('C')
  const { gropid } = useParams()
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('#090300')
  const [isRoomDetailsFetched, setIsRoomDetailsFetched] = useState(false)
  const rightDivRef = useRef()
  const leftDivRef = useRef()
  const codePad = useRef()
  const { socketRef, fontSizeProvider } = useContext(SocketContext)
  const { toastMessage } = useToast()
  const navigate = useNavigate()
  const { userDetails } = useContext(SocketContext)
  let preventEvent = false
  let contentLastScrollTop = useState(0)

  const onTopScroll = (e) => {
    if (preventEvent) {
      preventEvent = false
      return
    }
    preventEvent = true
    rightDivRef.current.scrollTop = e.target.scrollTop
  }

  const onContentScroll = (e) => {
    if (preventEvent) {
      preventEvent = false
      return
    }
    if (e.target.scrollTop !== contentLastScrollTop) {
      preventEvent = true
      codePad.current.scrollTop = e.target.scrollTop
      contentLastScrollTop = e.target.scrollTop
    }
  }

  useEffect(() => {
    socketRef.current?.on('send dataTextValue', (data) => {
      const data_message = data.message || ''
      HighLightText(data_message)
      setTextAreaValue(data_message)
    })

    socketRef.current?.on('sendUpdatedTitle', (data) => {
      setTitle(data.title)
    })

    socketRef.current?.on('sendUpdatedLanguage', (data) => {
      setSelectedLanguage(data.syntax)
    })
  }, [])

  const HighLightText = (valueforHighlight = textAreaValue) => {
    try {
      const highVal = hljs.highlight(valueforHighlight, {
        language: selectedLanguage ? selectedLanguage : 'C',
      }).value
      codePad.current.innerHTML = highVal
    } catch (e) {
      toastMessage('This Language is not available', 'warning')
    }
  }

  useEffect(() => {
    HighLightText()
  }, [selectedLanguage])

  const debouncedSaveCode = useCallback(
    debounce(async (updatedTitle) => {
      if (!isRoomDetailsFetched) return
      try {
        await axiosPost('/update-code', {
          title: updatedTitle,
          syntax: selectedLanguage ? selectedLanguage : 'C',
          roomID: gropid,
        })
      } catch (error) {
        throw error
      }
    }, 2000),
    [isRoomDetailsFetched, selectedLanguage, gropid]
  )

  const createRoomId = useCallback(() => {
    socketRef?.current?.emit(
      'addRoomId',
      {
        userId: userDetails?.id,
        title: title ? title : '',
        syntax: selectedLanguage ? selectedLanguage : 'C',
      },
      (data) => {
        if (data?.roomId) {
          navigate(`/room/${data?.roomId}`)
          setTitle('')
          setTextAreaValue('')
          setSelectedLanguage('C')
          codePad.current.innerHTML = ''
        }
      }
    )
  }, [socketRef, userDetails, title, selectedLanguage, navigate])

  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        const data = await axiosGet(`/get-room/${gropid}`)
        if (Object.keys(data).length > 0) {
          setTitle(
            data?.title
              ? data?.title
              : moment(data?.updated_at).format('MMM DD h:mm A')
          )
          setSelectedLanguage(data?.syntax)
          setIsRoomDetailsFetched(true)
        } else {
          createRoomId()
        }
      } catch (error) {
        console.error('Error getting room details:', error)
      }
    }
    getRoomDetails()
  }, [gropid])

  useEffect(() => {
    if (isRoomDetailsFetched) {
      debouncedSaveCode(title)
    }
  }, [title, selectedLanguage, gropid, isRoomDetailsFetched, debouncedSaveCode])

  return (
    <>
      <NotepadNavbar title={title} showShareButton={true} />
      <div className="d-flex" style={{ height: 'calc(100vh - 60px)' }}>
        <div
          style={{
            overflow: 'scroll',
            textAlign: 'end',
            width: 30,
            background: theme,
            color: '#5c5855',
            lineHeight: '15pt',
            paddingRight: 5,
          }}
          id="left"
          ref={leftDivRef}
          className="HideScrollBar d-flex flex-column"
          onScroll={onTopScroll}
        >
          {textAreaValue?.split('\n').map((item, index) => (
            <div style={{ fontSize: fontSizeProvider }} key={index}>
              {index + 1}
            </div>
          ))}
        </div>
        <div className="position-relative  w-100">
          <Textarea
            placeholder="Write or paste code here then share. Anyone you share with will see code as it is typed!"
            ref={rightDivRef}
            value={textAreaValue}
            style={{ fontSize: fontSizeProvider }}
            onChange={({ target }) => {
              var value = target.value
              socketRef.current.emit('receive dataText', {
                data: target.value,
                roomID: gropid,
              })
              setTextAreaValue(value)
              if (value[value.length - 1] === '\n') {
                value += ' '
              }
              HighLightText(value)
              codePad.current.scrollTop = target.scrollTop
            }}
            onScroll={onContentScroll}
            id="CodePadTextArea"
          ></Textarea>

          <CodePadDiv
            style={{ fontSize: fontSizeProvider, background: theme }}
            id="CodePadDiv"
            ref={codePad}
          ></CodePadDiv>
        </div>
        <VideoCall />
        <SideNavbar
          setSelectedLanguage={setSelectedLanguage}
          selectedLanguage={selectedLanguage}
          setTextAreaValue={setTextAreaValue}
          codePad={codePad}
          setTitle={setTitle}
          title={title}
          theme={theme}
          setTheme={setTheme}
          textAreaValue={textAreaValue}
        />
      </div>
    </>
  )
}
