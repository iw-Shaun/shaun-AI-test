import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UploadAndDisplayImage from '../hooks/UploadAndDisplayImage'

const defaultValue = 20

const FileUpload = (props) => {
  // state to store the selected file.
  const [selectedFile, setSelectedFile] = useState({input:null,age:defaultValue});
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
    console.log('filename',filename)
      try {
          // We will send formData object as a data to the API URL here.
          const response = await axios.put(`/getAI`,{
            data:{
              version: "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
              input:{
                image: filename,
                target_age: selectedFile.age,
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
            <p style={{whiteSpace: 'nowrap'}}>輸入年齡：</p>
            <input type="text" defaultValue={defaultValue} onChange={e => setSelectedField({age: e.target.value})}></input>
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
      <h1>年齡轉換器</h1>
      <div className='showcase'>
        {preview.input ?  <img src={preview.input} /> : '請上傳圖片'}
      </div>
      <FileUpload setPreview={setPreviewField} />
      <div className='showcase'>
        {preview.output ?  <img src={preview.output} /> : preview.status}
      </div>
    </main>
  );
}

export default LiffPage;
