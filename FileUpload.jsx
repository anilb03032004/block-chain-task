import {useState} from "react"



const FileUpload=()=>{


  const [file,setFile]=useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch('https://localhost:5000/upload', {
              method: 'POST',
              body: formData
            });
            if (response.ok) {
              const data = await response.json();
              console.log(data.cid);
            } else {
              console.error('Failed to upload file');
            }
          }
        
      }catch(error){
        console.error(error);
        alert(error.message);
      }
      
    }
    const retrieveFile=(event)=>{

    try{
        const data =event.target.files[0];
        setFile(data);
        event.preventDefault();
    }catch(error){
        alert("Retrieve File Does not Worked");
    }
    }
         return(
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <input type="file" className="choose" onChange={retrieveFile}/>
                    <button   className="btn">Mint the NFT</button>
                </form>
            </div>
         );
}

export default FileUpload;