const create = require('ipfs-http-client')
const fs = require('fs')


async function saveToIPFS(file) {
    

    const client = create('https://ipfs.infura.io:5001/api/v0')

    const added = await client.add(file,
    {
        progress: (prog) => console.log(`received: ${prog}`)
    }
    )
    const url = `https://ipfs.infura.io/ipfs/${added.path}`

    console.log(url)
}

const img = '../../images/1.png'
console.log(img)

file = fs.readFile(img,(err) => {
        if(err) 
            console.log(err)
        else 
            console.log("File read ok")

    })

saveToIPFS()