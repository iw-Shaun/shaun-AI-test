import React, { useState, useEffect } from "react";

const UploadAndDisplayImage = (props) => {
  const [product, setProduct] = useState({images:[]});
  const [selectedImage, setSelectedImage] = useState(null);

  const setProductField = (data) => {
    setProduct({ ...product, ...data });
  }

  useEffect(() => {
    // Set the callback.
    window.SetUrl = (items) => {
      if (Array.isArray(items) && items.length > 0) {
        setSelectedImage(items);
      }
    };
    return (() => {
      window.SetUrl = undefined;
    });
  }, []);
  
  useEffect(() => {
    // Detect the image variable changed, then update product.
    if (selectedImage) {
      var images = product[`images`]??[];
      selectedImage.map((item)=>{
        const coverImageUrl = new URL(item.url);
        const coverThumbUrl = new URL(item.thumb_url);
        images = [
          ...images,
          {
            name: item.name,
            cover_image: coverImageUrl.pathname,
            cover_thumb: coverThumbUrl.pathname,
          }
        ]
      });
      setProductField({[`images`]: images});
    }
  }, [selectedImage]);

  const onClickSave = () => {
    // Update the content when save to server.
    const data = { ...product };
    
    // data['content'] = CKEDITOR.instances['content-editor'].getData();
    axios.put(`/store/${season}`, data)
      .then((res) => {
        alert('更新成功');
      })
      .catch((err) => {
        alert('更新失敗');
      });
  }

  const onClickCoverImageSelect = () => {
      window.open('/laravel-filemanager?type=Images', 'FileManager', 'width=900,height=600');
  }

  return (
    <div style={{margin:'15vw'}}>
      <button onClick={()=>onClickCoverImageSelect()}>選擇檔案</button>
      <button onClick={()=>onClickSave()}>上傳</button>
    </div>
  );
};

export default UploadAndDisplayImage;