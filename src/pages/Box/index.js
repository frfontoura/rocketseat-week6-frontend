import React, { Component } from 'react'
import { MdInsertDriveFile } from 'react-icons/md'
import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import DropZone from 'react-dropzone'
import socket from 'socket.io-client'

import api from '../../services/api'

import logo from '../../assets/logo.svg'
import './styles.css'

export default class Box extends Component {

    state = {
        box: {}
    }

    async componentDidMount() {
        this.subscribeToNewFiles()

        const response = await api.get(`boxes/${this.props.match.params.id}`)

        this.setState({ ...this.state, box: response.data })
    }

    subscribeToNewFiles = () => {
        const io = socket('https://frf-omnistack-backend.herokuapp.com')

        io.emit('connectRoom', this.props.match.params.id)

        io.on('file', data => {
            this.setState({
                ...this.state,
                box: { 
                    ...this.state.box, 
                    files: [ data, ...this.state.box.files]
                }
            })
        })
    }

    handleUpload = files => {
        files.forEach(file => {
            const data = new FormData()

            data.append('file', file)

            api.post(`boxes/${this.props.match.params.id}/files`, data)
        });
    }

    render() {
        const { box } = this.state

        return <div id='box-container'>
            <header>
                <img src={logo} alt="" />
                <h1>{box.title}</h1>
            </header>

            <DropZone onDropAccepted={this.handleUpload}>
                {({ getRootProps, getInputProps }) => (
                    <div className='upload' { ...getRootProps() }>
                        <input { ...getInputProps() } />

                        <p>Arraste arquivos ou clique aqui!</p>
                    </div>
                )}
            </DropZone>

            <ul>
                { box.files && box.files.map(file => (
                    <li key={file._id}>
                        <a className='fileInfo' href={file.url} target="_blank" rel="noopener noreferrer">
                            <MdInsertDriveFile size={24} color="#A5Cfff" />
                            <strong>{file.title}</strong>
                        </a>

                        <span>há {distanceInWords(file.createdAt, new Date(), {
                            locale: pt
                        })}</span>
                    </li>
                ))}
            </ul>
        </div>
    }
}