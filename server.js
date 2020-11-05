const express = require('express')
const serveStatic = require('serve-static')
const path = require('path');

const bodyParser = require('body-parser');

const ipfsClient =  require('ipfs-http-client')

const BufferList =  require('bl/BufferList')

// import fs from 'fs'

// const fs = window.require('fs');

const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


if (typeof fetch !== 'function') {
  global.fetch = require('node-fetch-polyfill');
}

const fs = require('fs');

//solve env for node
require('./myEnv.js');
  

const nvt = require('node-virustotal');
// const slowInstance = nvt.makeAPI();
const defaultTimedInstance = nvt.makeAPI();

// const fs = require('fs')
// const VirusTotalApi = require('virustotal-api')
// const virusTotal = new VirusTotalApi('f27ea9ea6942e4d702342d79a7c985acd31459fb7cc5637a04592b1f2af9692d')


// const theSameObject = defaultTimedInstance.initialScanURL('http://wikionemore.com', function(err, res){
//   if (err) {
//     console.log('Well, crap.');
//     console.log(err);
//     return;
//   }
//   console.log(JSON.stringify(res));
//   return;
// });

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')));


app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

app.post('/api/scanUrl',async function (req, res) {
    
    console.log(`in scanUrl`)
    try{

   
        const url =  req.body.url;

        // const theSameObject = await defaultTimedInstance.initialScanURL(url);
        // console.log(`theSameObject: ${JSON.stringify(theSameObject)}`);
        // res.send(`theSameObject: ${JSON.stringify(theSameObject)}`);

        const theSameObject = defaultTimedInstance.initialScanURL(url, function(err, result){
        if (err) {
            // console.log('Well, crap.');
            console.log(err);
            res.status(500).send(`theSameObject: ${err}`);
            return;
        }
        
        // res.status(200).send(`theSameObject: ${JSON.stringify(result)}`);
        
        const jsonObject = JSON.parse(result);

        // console.log(`test: ${test}`)
        // console.log(`test.data: ${test.data}`)
        console.log(`test.data.id: ${jsonObject.data.id}`)
        const id = jsonObject.data.id;

        const res2 = res;

        const theAnalysisObject = defaultTimedInstance.getAnalysisInfo(`${id}`, function(err2, result2){
            if (err2) {
              console.log('anaylsis, error');
              console.log(err2);
              res.status(500).send(`theAnalysisObject: ${err2}`);

              return;
            }

            const totalResult =  {

                result,

                result2
            }

            console.log(`anaylsis, result: ${JSON.stringify(result2)}`);
            
            // res.status(200).send(`theSameObject: ${JSON.stringify(result2)}`);
            res.status(200).send(totalResult);

            console.log(JSON.stringify(totalResult));
            return;
          });

        // console.log(result);

        // console.log(result.data);

        // console.log(`JSON: ${JSON.stringify(result)}`);

        // console.log(`id: ${result.data.id}`);

        return;
        });

    }catch(error){

        res.status(500).send(`theSameObject: ${error}`);

        console.log(`error: ${error}`)
    }
});

app.post('/api/saveFile',async function (req, res) {

  console.log(`in saveFile`)
  
  const cid = req.body.hash;

  let i = 0;
  for await (const file of ipfs.get(cid)) {

      i++;
      // console.log(`file#${i}: ${JSON.stringify(file)}`)        
      
      fileComonents = file.path.split('/');
      console.log(`fileName${i}: ${fileComonents[fileComonents.length - 1]}`);        
      const fileName = fileComonents[fileComonents.length - 1];

      // const fileContent = await file.content;
      const content = new BufferList()

      // console.log(file.path)
      if(typeof file.content != 'undefined'){


          let j = 1;
          for await (const chunk of file.content) {
            
            // if(i  == 3){

            //   // console.log(`${i} chunk#${j}: ${chunk}`);
            //   j++;
            // }
              content.append(chunk)
          }  
          
      //3, 4, 17, 23
      if(i  == 23){
      // if(i  == 3){

        // console.log(`content: ${content}`)
      // console.log(`file#${i}: ${JSON.stringify(file)}`)        
      // console.log(`fileName${i}: ${fileComonents[fileComonents.length - 1]}`);        

      // console.log(`fileContent#${i}: ${fileContent}`)        
        // console.log(`content#${i}: ${content}`)        

        // console.log(`json of content#${i}: ${JSON.stringify(content)}`) 
        // console.log(`content[0]#${i}: ${content._bufs[0]}`)    
        // console.log(`content[0].toString('binary'): ${content._bufs[0].toString('binary')}`);        
    
   
        // console.log(`json of content[0]#${i}: ${JSON.stringify(content._bufs[0])}`)        
        // console.log(`json of content[0].type#${i}: ${JSON.stringify(content._bufs[0].type)}`)        
        // console.log(`json of content[0].data#${i}: ${JSON.stringify(content._bufs[0].data)}`)        


        // console.log(`binary: ${content.toString('binary')}`);
        // console.log(`typeof :${typeof content}`);

        // console.log(`content: ${content}`);

        // fs.writeFile(fileName, content.toString('binary'),'base64',function(err){
        // fs.writeFile(`saving-files/${fileName}`, content.toString('binary'),null,function(err){
        // fs.writeFile(`saving-files/${fileName}`, content._bufs[0].toString('binary'),null,function(err){

        console.log(`content.length: ${content._bufs.length}`);
        // fs.writeFile(`saving-files/${fileName}`, content._bufs[0],{flag: 'a+'},function(err){

            //   if (err) {
    
            //     console.log(`error: ${err}`);
            //     throw err
            //   };
            //   console.log('Data written to file');
            // });
          

            for (let k = 0; k < content._bufs.length; k++){
    
              fs.writeFile(`saving-files/${fileName}`,  content._bufs[k], {flag: 'a+'}, (err) => {     

                  if (err) {
        
                    console.log(`error: ${err}`);
                    throw err
                  };
                  console.log('Data written to file');
                });

              // console.log(`buf#${k}: ${buf}`)
            }


        // fs.readFile(`saving-files/${fileName}`, 'utf8', function(err, data){

        //   if(!err){

        //     console.log(`data: ${data}`)

        //   }else{

        //     console.log(`error: ${err}`)
        //   }
        // });
        
        // console.log(`in save file`);
      }

      // console.log(`content: ${content.toString()}`)

      }
  }
});

app.post('/api/readFile',async function (req, res) {

  console.log(`in readFile`)
  
  const fileName = req.body.fileName;

  console.log(`fileName: ${fileName}`)

  let i = 0;
  

        fs.readFile(`saving-files/${fileName}`, 'utf8', function(err, data){

          if(!err){

            console.log(`data: ${data}`)

          }else{

            console.log(`error: ${err}`)
          }
        });
        
        // console.log(`in save file`);
});

const port = process.env.PORT || 8080
app.listen(port)
// console.log('app started');
