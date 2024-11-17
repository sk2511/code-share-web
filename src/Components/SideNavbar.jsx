import React, { useState, useContext } from 'react'
import { IoMdSettings, IoMdVideocam } from 'react-icons/io'
import { FaDownload, FaPlus, FaSearchMinus, FaSearchPlus } from 'react-icons/fa'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { SocketContext } from './SocketContext'
import { IoClose } from 'react-icons/io5'
import { MdOutlineCallEnd } from 'react-icons/md'
import ErrorPopUp from './ErrorPopUp'
import ConfirmationModal from './ConfirmationModal'

const TopIcon = styled.div`
  display: block;
  padding: 7px 15px;
  border: none;
  border-bottom: 1px solid #222;
  color: ${({ active }) => (active ? '#555' : 'hsla(0, 0%, 100%, 0.6)')};
  font-size: 24px;
  width: 100%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ active, index }) =>
    active && index === 0 ? '#fff' : 'none'};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  &:hover {
    color: ${({ active, index, disabled }) =>
      disabled ? '#555' : active && index === 0 ? '#555' : '#fff'};
  }
`

const SideNavWrap = styled.div`
  background: #30353e;
  position: relative;
`

const SideNavSubDrawer = styled.div`
  width: 250px;
  padding: 20px;
  background: '#fff';
  display: ${(props) => (props.active ? 'block' : 'none')};
`
const syntaxes = [
  { value: 'C', label: 'C' },
  { value: 'C#', label: 'C#' },
  { value: 'C++', label: 'C++' },
  { value: 'Clojure', label: 'Clojure' },
  { value: 'CMake', label: 'CMake' },
  { value: 'CSS', label: 'CSS' },
  { value: 'D', label: 'D' },
  { value: 'Dart', label: 'Dart' },
  { value: 'Django', label: 'Django' },
  { value: 'Dockerfile', label: 'Dockerfile' },
  { value: 'Go', label: 'Go' },
  { value: 'HAML', label: 'HAML' },
  { value: 'HTTP', label: 'HTTP' },
  { value: 'Java', label: 'Java' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'JSON', label: 'JSON' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'LaTeX', label: 'LaTeX' },
  { value: 'LiveScript', label: 'LiveScript' },
  { value: 'Nginx', label: 'Nginx' },
  { value: 'Objective-C', label: 'Objective-C' },
  { value: 'PHP', label: 'PHP' },
  { value: 'PlainText', label: 'PlainText' },
  { value: 'PowerShell', label: 'PowerShell' },
  { value: 'Puppet', label: 'Puppet' },
  { value: 'Python', label: 'Python' },
  { value: 'Q', label: 'Q' },
  { value: 'R', label: 'R' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Rust', label: 'Rust' },
  { value: 'SAS', label: 'SAS' },
  { value: 'Scala', label: 'Scala' },
  { value: 'SCSS', label: 'SCSS' },
  { value: 'Shell', label: 'Shell' },
  { value: 'SQL', label: 'SQL' },
  { value: 'Swift', label: 'Swift' },
  { value: 'TOML', label: 'TOML' },
  { value: 'VBScript', label: 'VBScript' },
  { value: 'XQuery', label: 'XQuery' },
  { value: 'YAML', label: 'YAML' },
]

const themes = [
  { value: '#090300', label: 'Dark' },
  { value: '#FFFFFF', label: '3024-day' },
  { value: '#1C1C1C', label: '3024-night' },
  { value: '#282A36', label: 'base16-dark' },
  { value: '#FDF6E3', label: 'base16-light' },
  { value: '#EDEDED', label: 'bespin' },
  { value: '#002240', label: 'cobalt' },
  { value: '#2D2A2E', label: 'colorforth' },
  { value: '#1F1F1F', label: 'duotone-dark' },
  { value: '#F6F7F9', label: 'duotone-light' },
  { value: '#F6F6F6', label: 'eclipse' },
  { value: '#B7B7B7', label: 'liquibyte' },
  { value: '#F7F7F7', label: 'mdn-like' },
  { value: '#191C24', label: 'midnight' },
  { value: '#F8F8F2', label: 'monokai' },
  { value: '#2C2A29', label: 'neo' },
  { value: '#1C1C2E', label: 'oceanic-next' },
  { value: '#2D2D2D', label: 'paraiso-dark' },
  { value: '#F5F5F5', label: 'paraiso-light' },
  { value: '#2B2B2B', label: 'pastel-on-dark' },
  { value: '#F3F4F4', label: 'railscasts' },
  { value: '#F0F0F0', label: 'rubyblue' },
  { value: '#1A1A1A', label: 'shadowfox' },
  { value: '#2C2C2C', label: 'tomorrow-night-bright' },
  { value: '#1E1E1E', label: 'xq-dark' },
  { value: '#3F3F3F', label: 'zenburn' },
]

export default function SideNavbar({
  setSelectedLanguage,
  selectedLanguage,
  setTextAreaValue,
  codePad,
  title,
  setTitle,
  setTheme,
  textAreaValue,
}) {
  const [drawerOPen, setDrawerOpen] = useState(false)
  const [openErrorPopUp, setOpenErrorPopUp] = useState(false)
  const [openAskForNewCode, setOpenAskForNewCode] = useState(false)
  const navigate = useNavigate()
  const { gropid } = useParams()
  const {
    VideoCallStart,
    CallOnline,
    VideoCallEnd,
    setFontSizeProvider,
    socketRef,
    userDetails,
  } = useContext(SocketContext)

  const createRoomId = () => {
    socketRef?.current?.emit(
      'addRoomId',
      {
        userId: userDetails?.id,
        title: title ? title : '',
        syntax: selectedLanguage ? selectedLanguage : 'C',
      },
      (data) => {
        if (data?.error) {
          setOpenAskForNewCode(false)
          setOpenErrorPopUp(true)
        }
        if (data?.roomId) {
          setOpenAskForNewCode(false)
          navigate(`/room/${data?.roomId}`)
          setTitle('')
          setTextAreaValue('')
          setSelectedLanguage('C')
          codePad.current.innerHTML = ''
        }
      }
    )
  }

  const onClickDownload = () => {
    if (!textAreaValue) return
    const element = document.createElement('a')
    const file = new Blob([textAreaValue], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${title}.txt`
    document.body.appendChild(element)
    element.click()
  }

  return (
    <>
      <SideNavWrap>
        {[
          {
            icons: <IoMdSettings size={16} />,
            onClick: () => setDrawerOpen(true),
            tooltip: 'Editor settings',
          },
          {
            icons: CallOnline ? (
              <MdOutlineCallEnd size={16} />
            ) : (
              <IoMdVideocam size={16} />
            ),
            tooltip: 'Start Videochat',
            onClick: () => (CallOnline ? VideoCallEnd() : VideoCallStart()),
          },
          {
            icons: <FaDownload size={16} />,
            tooltip: 'Download',
            onClick: onClickDownload,
            disabled: !textAreaValue,
          },
          {
            icons: <FaPlus size={16} />,
            onClick: () => {
              setOpenAskForNewCode(true)
            },
            tooltip: 'Create New Codeshare',
          },
          {
            icons: <FaSearchPlus size={16} />,
            onClick: () => {
              setFontSizeProvider((old) => (old > 20 ? old : (old += 1)))
            },
            tooltip: 'increase Font Size',
          },
          {
            icons: <FaSearchMinus size={16} />,
            onClick: () => {
              setFontSizeProvider((old) => (old > 14 ? (old -= 1) : old))
            },
            tooltip: 'decrease Font Size',
          },
        ].map((item, index) => (
          <TopIcon
            key={index}
            active={drawerOPen}
            index={index}
            className="custom-tooltip"
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item?.icons}
            <span className="tooltiptext">{item?.tooltip}</span>
          </TopIcon>
        ))}
      </SideNavWrap>
      <SideNavSubDrawer active={drawerOPen}>
        <div className="d-flex justify-content-between">
          <h3 style={{ fontWeight: 200 }}>Settings</h3>
          <IoClose
            style={{ cursor: 'pointer' }}
            onClick={() => setDrawerOpen(false)}
          />
        </div>
        <div>
          <div className="w-100">
            <span>Title</span>
            <input
              type="text"
              placeholder="Title"
              className="input"
              name="title"
              value={title}
              maxLength={25}
              onChange={(e) => {
                var value = e.target.value
                socketRef.current.emit('updateRoomTitle', {
                  roomID: gropid,
                  title: value,
                })
                setTitle(value)
              }}
            ></input>
          </div>
          <div className="form-field mt-3">
            <label htmlFor="modeName">Syntax</label>
            <select
              name="modeName"
              className="w-100"
              type="select"
              value={selectedLanguage}
              onChange={(e) => {
                socketRef.current.emit('updateRoomSyntax', {
                  roomID: gropid,
                  syntax: e.target.value,
                })
                setSelectedLanguage(e.target.value)
              }}
            >
              {syntaxes.map((syntax) => (
                <option key={syntax.value} value={syntax.value}>
                  {syntax.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field mt-3">
            <label htmlFor="theme">Theme</label>
            <select
              name="theme"
              className="w-100"
              type="select"
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SideNavSubDrawer>
      <ErrorPopUp
        show={openErrorPopUp}
        onClose={() => {
          setOpenErrorPopUp(false)
        }}
        errorMessage="User cannot have more than 10 room entries."
      />
      <ConfirmationModal
        show={openAskForNewCode}
        onClose={() => {
          setOpenAskForNewCode(false)
        }}
        onConfirm={createRoomId}
        title="Create New Codeshare"
        bodyText="Are you sure you want to create a new codeshare?"
      />
    </>
  )
}
