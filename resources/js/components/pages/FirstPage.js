import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UploadAndDisplayImage from '../hooks/UploadAndDisplayImage'

const FileUpload = (props) => {
  // state to store the selected file.
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseId, setResponseId] = useState(null);

  useEffect(()=>{
    if(selectedFile){
      const objectUrl = URL.createObjectURL(selectedFile)
      props.setPreview(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  },[selectedFile])

  useEffect(()=>{
    if(responseId) handleResponse()
  },[responseId])

  const handleResponse = async () => {
    try {
      // We will send formData object as a data to the API URL here.
      const response = await axios.get(`/getResponse/${responseId}`)
      .then((res) => {
        if (res.data.output)
          console.log("Successfully\n",res.data);
        else
          console.log("not yet\n",res.data);
          setTimeout(() => handleResponse(), 1000);
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
      formData.append("selectedFile", selectedFile);

      try {
          // We will send formData object as a data to the API URL here.
          const response = await axios.post("/store", formData, {
              headers: {"Content-Type": "multipart/form-data"}
          }).then((res) => {
            if(res.data){
              console.log("File Uploaded Successfully\n",res.data);
              setResponseId(res.data.id)
            }
            else
              console.error("File Uploaded failed");
          });
      } catch (error) {
          console.log(error)
      }
  }

  const handleFileSelect = (event) => {
    console.log(event.target.files[0])
    // we only get the selected file from input element's event
    setSelectedFile(event.target.files[0])
  }

  return (
      <form className='upload' onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileSelect}/>
          <input type="submit" value="上傳圖片"/>
      </form>
  )
};

function LiffPage() {
  const [preview, setPreview] = useState()
  useEffect(() => {
    // axios.get('/getAI')
    //   .then((res)=>{
    //     console.log(res.data)
    //   })
    //   .catch((err)=>{
    //     console.error(err)
    //   })
  }, []);

  return (
    <main className='first-page'> 
      <div className='showcase'>
        {preview ?  <img src={preview} /> : '請上傳圖片'}
      </div>
      <FileUpload setPreview={setPreview} />
    </main>
  );
}

export default LiffPage;
