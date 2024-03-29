import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UploadAndDisplayImage from '../hooks/UploadAndDisplayImage'

const defaultValue = 'animate girl'
const defaultA_prompt = "2D, smile, best quality, extremely detailed"

const FileUpload = (props) => {
  // state to store the selected file.
  const [selectedFile, setSelectedFile] = useState({input:null,prompt:defaultValue,a_prompt:defaultA_prompt});
  const [responseId, setResponseId] = useState(null);

  const setSelectedField = (data) => {
    setSelectedFile({ ...selectedFile, ...data });
  }

  useEffect(()=>{
    if(selectedFile.input){
      const objectUrl = URL.createObjectURL(selectedFile.input)
      props.setPreview({input:objectUrl})

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  },[selectedFile?.input])

  useEffect(()=>{
    if(responseId) handleResponse()
  },[responseId])

  const handleResponse = async () => {
    try {
      // We will send formData object as a data to the API URL here.
      const response = await axios.get(`/getResponse/${responseId}`)
      .then((res) => {
        console.log(res);
        if (res.data.output)
          props.setPreview({output:res.data.output})
        else{
          props.setPreview({status: res.data.status})
          setTimeout(() => handleResponse(), 1000);
        }
      });
    } catch (error) {
        console.log(error)
    }
  }

  const handleGetAI = async (filename) => {
      try {
          // We will send formData object as a data to the API URL here.
          const response = await axios.put(`/getAI`,{
            data:{
              version: "922c7bb67b87ec32cbc2fd11b1d5f94f0ba4f5519c4dbd02856376444127cc60",
              input:{
                image: filename,
                prompt: selectedFile.prompt,
                num_samples: "1",
                image_resolution: "512",
                ddim_steps: 20,
                scale: 9,
                eta: 0,
                a_prompt: selectedFile.a_prompt,
                n_prompt: "3D, longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
                detect_resolution: 512,
              }
            }
          })
          .then((res) => {
            if(res.data){
              setResponseId(res.data.id)
            }
            else
              console.error("File Uploaded failed");
          });
      } catch (error) {
          console.log(error)
      }
  }

  const handleSubmit = async (event) => {
      event.preventDefault();

      // Create a FormData object
      const formData = new FormData();
      // Append file to the formData object here
      formData.append("selectedFile", selectedFile.input);

      try {
          // We will send formData object as a data to the API URL here.
          const response = await axios.post("/store", formData, {
              headers: {"Content-Type": "multipart/form-data"}
          }).then((res) => {
              handleGetAI(res.data)
          });
      } catch (error) {
          console.log(error)
      }
  }

  return (
      <form className='upload' onSubmit={handleSubmit}>
        <div style={{width:'80vw',display:'flex'}}>
            <p style={{whiteSpace: 'nowrap'}}>輸入關鍵字：</p>
            <input type="text" defaultValue={defaultValue} onChange={e => setSelectedField({prompt: e.target.value})}></input>
        </div>
        <div style={{width:'80vw',display:'flex'}}>
            <p style={{whiteSpace: 'nowrap'}}>輸入參數：</p>
            <input type="text" defaultValue={defaultA_prompt} onChange={e => setSelectedField({a_prompt: e.target.value})}></input>
        </div>
        <div style={{width:'80vw',display:'flex'}}>
          <input type="file" onChange={e => setSelectedField({input: e.target.files[0]})}/>
          <input type="submit" value="上傳圖片"/>
        </div>
      </form>
  )
};

function LiffPage() {
  const [preview, setPreview] = useState({input:null,output:null,status:'null'})

  const setPreviewField = (data) => {
    setPreview({ ...preview, ...data });
  }

  return (
    <main className='first-page'> 
      <h1>??轉換器</h1>
      <p>若狀態為Starting則須等待3~5分鐘</p>
      <div className='showcase'>
        {preview.input ?  <img src={preview.input} /> : '請上傳圖片'}
      </div>
      <FileUpload setPreview={setPreviewField} />
      <div className='showcase'>
        {preview.output ?  <img src={preview.output[1]} /> : preview.status}
      </div>
    </main>
  );
}

export default LiffPage;
