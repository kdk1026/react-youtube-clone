import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
];

const CategoryOptions = [
    { value: 0, label: "Film & Animaiton" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animaiton");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnatilPath, setThumbnatilPath] = useState("");

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    };

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    };

    const onPrivateCahnge = (e) => {
        setPrivate(e.currentTarget.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    };

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0]);

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    };

                    setFilePath(response.data.url);

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration);
                                setThumbnatilPath(response.data.url);
                            } else {
                                alert('썸네일 생성에 실패 했습니다.');
                            }
                        })

                } else {
                    alert('비디오 업로드를 실패했습니다.');
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variable = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnatil: ThumbnatilPath,
        };

        Axios.post('/api/video/uploadVideo', variable)
            .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 업로드를 했습니다.');

                    setTimeout(() => {
                        props.history.push('/');
                    }, 3000);

                } else {
                    alert('비디오 업로드에 실패 했습니다.');
                }
            })
    };

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone */}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}

                    </Dropzone>

                    {/* Thumbnail */}

                    {ThumbnatilPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnatilPath}`} alt="thumbnatil" />
                        </div>
                    }
                </div>

                <br/>
                <br/>

                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />

                <br/>
                <br/>

                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />

                <br/>
                <br/>

                <select onChange={onPrivateCahnge}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br/>
                <br/>

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br/>
                <br/>

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
