<template>
  
    <v-layout class="mt-16 d-flex">
        
        <div>

        
            <div>
            <label>File Hash:</label>
            </div>

            <div>
            <input v-model="hash"
            type="text" placeholder="Enter File Hash" >
            </div>

            <div v-if="!loading">
            <v-btn @click="getIpfsFile"
            class="mt-10">
                submit</v-btn>
            </div>

            <div v-if="loading" class="mt-10">
                
            <label>loading ...</label>

            </div>


            <div v-else-if="gotResult" class="mt-10">

                    <div class="mt-5">

                    <label>result {{result.result}}</label>
                </div>

                <div v-if="!showDetails" class="mt-5">
                
                    <v-btn @click="showDetails=!showDetails">Details</v-btn>
                </div>
            </div>
               
            <div v-if="showDetails" class="mt-5">

                <div class="mt-5">
                
                    <v-btn @click="showDetails=!showDetails">close</v-btn>
                </div>

                <div class="mt-5" style="width: 400px;">
                    
                    <label>result {{result}}</label>
                    <!-- <vue-json-pretty
                :path="'result2'"
                :data="result.result2"
                /> -->
                </div>
            </div>
            <div>

                <div v-if="gotError">

                <label>error {{error}}</label>
                </div>
            </div>

            <!-- <div class="mt-10 mb-10">

             <v-btn @click="printToConsole" class="mt-10">Print to console</v-btn>
            </div> -->

            <div v-if="duration != 0" class="mt-10 mb-10">

             <label>Duration: {{duration}}</label>
            </div>

            <div>
                
                <v-btn @click="printResults"
                class="mt-10">
                    console print</v-btn>

                <!-- <v-btn @click="readFileFromServer"
                class="mt-10">
                readFile</v-btn> -->
            </div>
        </div>            
    </v-layout>
</template>

<script>

import axios from 'axios'

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

// import FormData from 'form-data'

import  ipfsClient from  'ipfs-http-client'

import BufferList from 'bl/BufferList'

// import fs from 'fs'

// const fs = window.require('fs');

const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default {

    components: {
    // HelloWorld
    VueJsonPretty
    },

  methods:{

      printResults(){

          console.log(`results: ${JSON.stringify(this.allResults)}`);
      },

        async getIpfsFile(){

            this.allResults.splice(0, this.allResults.length);

            // console.log(`hash: ${this.hash}`);
            const cid = this.hash;

            let i = 0;
            // for await (const file of ipfs.get(cid)) {
            for await (const file of ipfs.get(cid)) {

            // for await (const file of ipfs.cat(cid)) {

                i++;
                // console.log(`file#${i}: ${JSON.stringify(file)}`)        
                
                // const content = await file.content;
                // console.log(`content#${i}: ${JSON.stringify(content)}`)        

                // console.log(file.path)
                if(typeof file.content != 'undefined'){
                // this.fileContent = file.content;

                    const content = new BufferList()
                    for await (const chunk of file.content) {
                        content.append(chunk)
                    }  

                    const oneResult = {

                        startTime: new Date().getTime(),
                    }

                    this.allResults.push(oneResult);

                    this.virusApiCall(content, oneResult);

                    if(i  ==  23){

                        // console.log(`file#${i}: ${JSON.stringify(file)}`)        

                        // console.log(`content: ${content}`);   
                        // console.log(`JSON of content: ${JSON.stringify(content)}`);  
                        // console.log(`content: ${content.toString()}`);   

                        // this.content = content;
                        // console.log(`content`);
                        // console.log(content);
                        // console.log(`fs: ${JSON.stringify(fs)}`);

                        // this.postFileToServer(content);
                        // fs.writeFile(`fayez ipfs file${i}`, content,'base64',function(err){
                    }

                // console.log(`content: ${content.toString()}`)

                }
            }


            // this.file =  await ipfs.get(cid);
            
            // let i  = 0;
            // if(this.file.hasNext()){

            //     console.log(`result${i+1} :${JSON.stringify(await this.file.next())}`);
            // }

            //  let i  = 0;
            //  console.log(`${}`)
            // const content = new BufferList()
            // while(i< 10){

            //     console.log(`in ${i+1} round`)
            //     const result = await this.file.next();
            //         content.append(result.content)
            //     console.log(`content${i+1} :${JSON.stringify(content)}`);

            //     // console.log(`result${i+1} :${JSON.stringify(result)}`);
            //     i++;
            // }

            // this.file.next();
            // console.log(`file: ${this.file}`);

            // console.log(`JSON of file: ${JSON.stringify(this.file)}`);

            // const result1 = await this.file.next();
            // // console.log(`result1: ${result1}`);
            // console.log(`JSON of result1: ${JSON.stringify(result1)}`);

            // const result2 = await this.file.next();
            // // console.log(`result2: ${result2}`);
            // console.log(`JSON of result2: ${JSON.stringify(result2)}`);

            // const result3 = await this.file.next();
            // // // console.log(`result2: ${result2}`);
            // console.log(`JSON of result3: ${JSON.stringify(result3)}`);

            // await this.file.next();
            // await this.file.next();
            // await this.file.next();
            // for await(let file of this.file) {
                
            //     console.log(file.path)

            //     const content = new BufferList()
            //     for await (const chunk of file.content) {
            //         content.append(chunk)
            //     }

            //     console.log(content.toString())
            // }

            // console.log(`finished`)
        },

        async postFileToServer(content){

           const result = await axios({method: 'post',
              
                url: '/api/saveFile', 

                data: {

                    message: content.toString()
                }
            });
        },

        async getIpfsFileToServer(){

            // console.log(`hash: ${this.hash}`);
            const cid = this.hash;

            const result = await axios({method: 'post',
            
            url: '/api/saveFile', 

            data: {

                hash: cid
            }});

            // console.log(`finished`)
        },

       async virusApiCall(content, oneResult){

        this.loading = true;
        this.gotResult = false;
        this.gotError = false;

        // console.log(`key:${process.env.VUE_APP_VIRUSTOTAL_KEY}`)

        let data = new FormData();
        
        // console.log(`this.file:${this.file}`);
        // console.log(`this.content:${this.content}`);
        // console.log(`typeof content:${typeof this.content}`);
        // console.log(`fileContent:${ this.fileContent}`);
        // console.log(`json of fileContent:${ JSON.stringify(this.fileContent)}`);

        // const blob = new Blob(this.content._bufs)
        // console.log(`blob:${JSON.stringify(blob)}`);
        // return;
        // data.append('file', this.fileAsDataUrl);


        const blob = new Blob(content._bufs)

        data.append('file', blob);
        
        const headers= {
        'x-apikey': process.env.VUE_APP_VIRUSTOTAL_KEY,
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',

        }

        // console.log(`data: ${JSON.stringify(data)}`)
        // console.log(`headers:${JSON.stringify(headers)}`);
        // console.log(`url:${this.url}`);


        try{

        // console.log(`this.file:${this.file}`);
        // console.log(`JSON of file:${JSON.stringify(this.file)}`);
        // console.log(`objectKeys of file:${Object.keys(this.file)}`);
        //   console.log(`string of file:${this.file.toString()}`);

        // console.log(`data:${JSON.stringify(data)}`);

        // return;
        const result = await axios({method: 'post',
                    
            url: 'https://www.virustotal.com/api/v3/files', 

            data,
            headers,
        });

        // console.log(`rawReponse: ${JSON.stringify(result)}`);
        // console.log(`id: ${JSON.stringify(result.data.data.id)}`);

        const id = result.data.data.id;
        // console.log(`id: ${id}`);

        const url2 = `https://www.virustotal.com/api/v3/analyses/${id}`;

        // console.log(`url2: ${url2}`);

        const result2 = await axios({method: 'get',
                    
            url: url2, 

            headers,
        });
        
        oneResult.endTime = new Date().getTime();

        // console.log(`rawReponse2: ${JSON.stringify(result2)}`)

        oneResult.result = result2;

        oneResult.duration = (oneResult.endTime - oneResult.startTime)/1000;

        this.loading = false;
        this.gotResult = true;
        this.result = result;

        // this.result = result.data;

        // console.log(`result: ${JSON.stringify(result.data)}`);
        }catch(error){

        this.loading = false;
        this.gotError = true;
        this.error = error;
        console.log(`error: ${JSON.stringify(error)}`)
        }
    },

    async readFileFromServer(){

        // const fileName = 'favicon.ico';
        // const fileName = 'manifest.json';
        const fileName = 'favicon-16x16.png';

        // var array = new Uint8Array([0x04, 0x06, 0x07, 0x08]);

        // var blob = new Blob([array]);       

        const result = await axios({method: 'post',
        
        url: '/api/readFile', 

        data: {

            fileName: fileName
        }});


        // console.log(`finished`)
        
    }
  },

  data: function(){

    return{

        hash: '',
        result: '',
        error: '',
        fileName:'',
        fileBuffer: null,
        file: null,
        fileContent: null,
        loading: false,
        gotResult: false,
        gotError: false,
        showDetails: false,
        startTime: 0,
        endTime: 0,
        duration: 0,
        content: null,
        allResults: []
      
    }
  }
}
</script>

<style>

</style>