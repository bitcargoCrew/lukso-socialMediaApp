export const config = {
    FUNDRAISING_CONTRACT_ADDRESS : "0x32E0A74DA9e3B221b9B290ee524b9BEA7826B502",
    // DATABASE : "http://localhost:3001",
    DATABASE : "https://fund-7hht.onrender.com",
    ReactQuill: {
        modules : {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          },
        
          formats : [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
          ],
    }
}