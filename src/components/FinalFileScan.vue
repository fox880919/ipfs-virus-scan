<template>
  
    <v-layout class="mt-16 d-flex">
        
        <div>

            <div class="mb-4">

                <v-switch
                v-model="isAsync"
                :label="switchText"
                :disabled="scanLoading || scanInProgress != 0"
                color="indigo"
                value="indigo"
                hide-details/>
           </div>
           
           <div v-if="isAsync" class="mb-4">

               <label style="color: red;">Note results will not be optimized/accurate  for  large number  of  scans</label>
           </div>

            <!-- <div v-if="highestDuration != 0" class="mt-10 mb-10"> -->
            <div vv-class="mt-10 mb-10">

                <label> Duration: {{highestDuration}}</label>
            </div>

            <!-- <div vv-class="mt-10 mb-10">

                <label> Total Duration: {{totalDuration}}</label>
            </div> -->
        
            <div>
                <label>File Hash:</label>
            </div>

            <div>
            <input v-model="hash"
            type="text" placeholder="Enter File Hash" >
            </div>

            <div v-if="!objectsLoading && !scanLoading && !objectsLoaded">
                <v-btn @click="getIpfsObjects"
                class="mt-10">
                    Prepare file objects</v-btn>
            </div>

            <div v-else-if="objectsLoading" class="mt-10">

                <label>... Objects Loading</label>
            </div>

            <!-- <div v-if="!loading">
                <v-btn @click="callGetIpfsFile"
                class="mt-10">
                    get file</v-btn>
            </div> -->

            <div v-if="objectsLoaded">
                <v-btn @click="scanIpfsObjects"
                class="mt-10">
                    Start scan objects</v-btn>
            </div>

            <div v-if="scanLoading || scanInProgress != 0" class="mt-10">
                
            <label>loading ...</label>

            </div>

            <div v-if="scanLoading || scanInProgress != 0" class="mt-10">
                
                <label>{{statusText}}</label>

            </div>

            <div v-else-if="gotResult && scanIsFinished" class="mt-10">

                <!-- <div class="mt-5">

                    <label>result: {{result.result}}</label>
                </div> -->

                <div v-if="!showDetails  && scanInProgress == 0" class="mt-5">
                
                    <v-btn @click="showDetailsMethod">Details</v-btn>
                </div>
            </div>
               
            <div v-if="showDetails  && scanInProgress == 0" class="mt-5">

                <div v-if="scanInProgress == 0" class="mt-5">
                
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

                <div v-if="gotError">

                    <v-btn @click="myReload()">Refresh</v-btn>
                </div>
            </div>

            <!-- <div class="mt-10 mb-10">

             <v-btn @click="printToConsole" class="mt-10">Print to console</v-btn>
            </div> -->

            <div v-if="duration != 0" class="mt-10 mb-10">

             <label>Duration: {{duration}}</label>
            </div>

            <!-- <div>

                 <v-btn @click="initiateCidsObject(true)"
                class="mt-10">
                Get Files</v-btn>
            </div> -->

            <div v-if="objectsLoaded">
            
                <v-btn @click="startCalculation"
                class="mt-10">
                 calculate highest duration</v-btn>
            </div>

            <!-- <div v-if="objectsLoaded">
            
                <v-btn @click="startTotalCalculation"
                class="mt-10">
                 calculate total duration</v-btn>
            </div> -->

            <!-- <div>
            
                <v-btn @click="printResults"
                class="mt-10">
                 print Results</v-btn>
            </div> -->

            <div v-if="allResults.length > 0" class="mt-5">

                <div class="detailsBorder mt-10" v-for="(result, index) in allResults" :key="index">

                    <file-scan-object :index="index+1" :result="result" />
                </div>

            </div>
        </div>            
    </v-layout>
</template>

<script>

import axios from 'axios'

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

// import FormData from 'form-data'
import fileScanObject from './FileScanObject'


import  ipfsClient from  'ipfs-http-client'

import BufferList from 'bl/BufferList'

// import fs from 'fs'

// const fs = window.require('fs');

const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// const ipfs = new ipfsClient('http://localhost:5001') // (the default in Node.js)

// const httpClient = axios.create();
// httpClient.defaults.timeout = 500000;

export default {

    components: {
    // HelloWorld
    VueJsonPretty,
    fileScanObject
    },

    computed:{

        switchText(){

            if(this.isAsync){

                return `Asynchronous is on`;
            }else{

                return 'Synchronous is on'
            }
        }
    },

  methods:{

      myReload(){

          location.reload();
      },

      showDetailsMethod(){

        this.showDetails= !this.showDetails;
        this.printCids();
      },

       startCalculation(){
        
        // console.log(`cidObjects: ${JSON.stringify(this.cidObjects)}`);

        this.calculateHighestDuration(this.cidObjects, '');
    },

    startTotalCalculation(){
        
        // console.log(`cidObjects: ${JSON.stringify(this.cidObjects)}`);

        this.calculateTotalDuration(this.cidObjects, '');
    },

    printCids(){
        
        console.log(`cidObjects: ${JSON.stringify(this.cidObjects)}`);
    },

    printResults(){
        

        console.log(`results: ${JSON.stringify(this.allResults)}`);
    },

    async initiateCidsObject(download){

        this.allResults.splice(0, this.allResults.length);

        if(this.cidObjects.length == 0){
            
            this.cidObjects = this.defaultResult;
        }

        // console.log(`cidObject: ${JSON.stringify(this.cidObjects)}`);

        for(let i = 0; i < this.cidObjects.length; i++){
            
            const index = i+'';

            if(download){

                await this.toGetIPFSFiles(this.cidObjects[i], index);
            }else{

                await this.toCatIPFSFiles(this.cidObjects[i], index);
            }
        }

        console.log(`finished finished finished finished finished finished finished finished`)

        console.log(`allResults: ${JSON.stringify(this.allResults)}`);
    },

    async toGetIPFSFiles(cidsObject, index){

        if(cidsObject.cidObjects.length != 0){

            for(let i = 0; i < cidsObject.cidObjects.length; i++){

                const newIndex = `${index}-${i}`;

                await this.toGetIPFSFiles(cidsObject.cidObjects[i], newIndex);
            }
        }else{

            const temp = await this.getAnIPFSFile(cidsObject.cid);
            
            this.allResults.push({
                
                anIndex: index,
                result: temp
            });
            // console.log(`at index: ${index}`);
            // console.log(`tempResults: ${JSON.stringify(temp)}`);
        }
    },

    // seccond option
    async toCatIPFSFiles(cidsObject, index){

        if(cidsObject.cidObjects.length != 0){

            for(let i = 0; i < cidsObject.cidObjects.length; i++){

                const newIndex = `${index}-${i}`;

                await this.toCatIPFSFiles(cidsObject.cidObjects[i], newIndex);
            }
        }else{

        //   const temp = await this.catIPFSFile(cidsObject.cid);
            const temp = await this.catIPFSFile(cidsObject.cid);
            
            this.allResults.push({
                
                anIndex: index,
                result: temp
            });
            
            // console.log(`at index: ${index}`);
            // console.log(`tempResults: ${JSON.stringify(temp)}`);
        }
    },

    async getAnIPFSFile(cid){

        for await (const file of ipfs.get(cid)) {

            if(typeof file.content != 'undefined'){

                const content = new BufferList()
                for await (const chunk of file.content) {
                    content.append(chunk)
                }
                
                // console.log(`content correct`);
                return content;
            }

            // console.log(`content wrong`);
            return 'no content';
        }
    },

    // seccond option
    async catIPFSFile(cid){

        const chunks = []
        for await (const chunk of ipfs.cat(cid)) {

        // console.log(`chunk: ${chunk}`);
        chunks.push(chunk)
        }

        console.log(`chunks.length: ${chunks.length}`);
        // return Buffer.concat(chunks).toString();
        // console.log(Buffer.concat(chunks).toString())
    },

    //last start
    async getIpfsObjects(){

        // console.log(`start ipfs file scan`);
        try{
            
            this.objectsLoading = true;
            let cid = this.hash;;
            if(cid.length < 1){

            cid =  `QmdFpswpqhq9U4Bim2XMDA6c7qUrD9bGcxLfAyP5ko3C8c`
            }else{

                console.log(`cid: ${this.hash.length}`);
            }

            const objectGet = await ipfs.object.get(cid);
            
            const links = this.getJsonObject(objectGet);
            // console.log(`links: ${JSON.stringify(links)}`);

            this.cidObjects =  new Array(links.length);

            for(let i = 0; i < links.length; i++){

                this.cidObjects[i] = {};

                this.cidObjects[i].name = links[i].name;

                this.cidObjects[i].rawResponses = 'loading';

                this.cidObjects[i].cid = links[i].cid;
                
                await this.addFirstCidOjbects(this.cidObjects[i], i); 

                // console.log(`still loading #${i+1}`);

                // console.log(`cidObjects: ${JSON.stringify(this.cidObjects)}`);
            }

            this.objectsLoaded = true;

            this.objectsLoading = false;

            // console.log(`cidObjects finished`);


            // console.log(`cidObjects: ${JSON.stringify(this.cidObjects)}`);
        //    this.callingPartialVirusApiCall(this.cidObjects);

            // let i = 1;

        
        }catch(error){

            this.objectsLoading = false;
            // this.objectsLoaded = true;

            this.gotError = true;
            this.error = error;
            this.objectsLoaded = false;
            console.log(`error: ${error}`)
            console.log(`stopped`)
        }
    },


    async addFirstCidOjbects(object, index){

        let linkExists = false;

        const objectGet = await ipfs.object.get(object.cid);

        const links = this.getJsonObject(objectGet);

        if( JSON.stringify(links) == '[]'){

            object.cidObjects = new Array(0);
 
        }else{

            linkExists = true;

        }

        if(linkExists == true){
            object.cidObjects = new Array(links.length);

             if(index == 0){

            }

            for(let i = 0; i < links.length; i++){

                object.cidObjects[i] = {};

                object.cidObjects[i].cid = links[i].cid;
                object.cidObjects[i].name = links[i].name;
                // object.cidObjects[i].rawResponses = 'loading';

                await this.addSecondCidObjects(object.cidObjects[i], index, i);
            }
        }
    },


    async addSecondCidObjects(object, previousIndex, index){

        let linkExists = false;

        const objectGet = await ipfs.object.get(object.cid);


        const links = this.getJsonObject(objectGet);


        if( JSON.stringify(links) == '[]'){
            
            object.cidObjects = new Array(0);
 
        }else{

            linkExists = true;

            object.cidObjects = new Array(links.length);

            for(let i = 0; i < links.length; i++){

                const newPreviousIndex = `${previousIndex}${index}`;

                object.cidObjects[i] = {};

                object.cidObjects[i].cid = links[i].cid;
                object.cidObjects[i].name = links[i].name;
                // object.cidObjects[i].rawResponses = 'loading';

               await this.addSecondCidObjects(object.cidObjects[i], newPreviousIndex, i);
            }
        }
    },

    async scanIpfsObjects(){

        this.scanLoading = true;
        
        try{

            for(let i = 0; i <  this.cidObjects.length; i++){

            this.cidObjects[i].results = new Array();

            await this.getIpfsFile(this.cidObjects[i].cid, this.cidObjects[i].results, true);

            if(this.cidObjects[i].cidObjects.length > 0){

                await this.embeddedscanIpfsObjects(this.cidObjects[i].cidObjects);
            }
        }

        console.log(`this.cidObjects: ${JSON.stringify(this.cidObjects)}`);
        
        // this.calculateHighestDuration(this.cidObjects, '');
            
            this.scanLoading = false;
            this.scanIsFinished =  true;

        }catch(e){

            console.log(`error ${e}`);
            this.scanLoading = false;  
        }

    },

    async embeddedscanIpfsObjects(cidObjects){

        for(let i = 0; i < cidObjects.length; i++){

            cidObjects[i].results = new Array();

            await this.getIpfsFile(cidObjects[i].cid, cidObjects[i].results, true);


             for(let k = 0; k < cidObjects[i].cidObjects.length; k++){


                await this.embeddedscanIpfsObjects(cidObjects[i].cidObjects[k]);
            }
        }
    },

    callGetIpfsFile(){

        // const oneResult = {
            
        //     cid: cid,
        //     name: name
        //     // startTime: new Date().getTime(),
        // }

        this.getIpfsFile(this.hash, this.allResults, false);
    },

    async getIpfsFile(cid, results, isForObjects){

        this.allResults.splice(0, this.allResults.length);

        // const cid = this.hash;

        let i = 0;

        // console.log(`start ipfs get file`);

        for await (const file of ipfs.get(cid)) {

            i++;
            // console.log(`#i: ${i}`);
            // console.log(`file#${i}: ${JSON.stringify(file)}`)   
            
            const pathSplit  = file.path.split('/');
            let name;
            if(pathSplit.length >  0){

                name =  pathSplit[pathSplit.length  - 1];

            }else{

                name  =  '';
            }

            if(typeof file.content != 'undefined'){

                const content = new BufferList()
                for await (const chunk of file.content) {
                    content.append(chunk)
                }  

                const oneResult = {
            
                    cid: cid,
                    name: name
                }

                results.push(oneResult);

                if(this.isAsync){

                    this.virusApiCall(content, oneResult);

                }else{

                    await this.virusApiCall(content, oneResult);
                }
            }

        }
            
            console.log(`end`);
    },


    async virusApiCall(content, oneResult){

        this.scanInProgress =  this.scanInProgress + 1;
        console.log(`one start, in  scan in progress: ${this.scanInProgress}`);

        this.statusText = `starting scan #${this.scanInProgress}`;

        // this.scanLoading = true;
        this.gotResult = false;
        this.gotError = false;

        let data = new FormData();
        

        const blob = new Blob(content._bufs)

        data.append('file', blob);
        
        const headers= {
        'x-apikey': process.env.VUE_APP_VIRUSTOTAL_KEY,
        }


        try{

         let result;   
        
        if(false){

            // console.log(`in is file big`);

            oneResult.startTime = new Date().getTime();
        
            const requestUrl = await axios({method: 'get',
                    
                url: 'https://www.virustotal.com/api/v3/files/upload_url', 

                // data,
                headers,
            });

            // console.log(`url #${this.scanInProgress}: ${JSON.stringify(requestUrl.data.data)}`);

            const uploadUrl = requestUrl.data.data;

            console.log(`url #${this.scanInProgress}: ${uploadUrl}`);

             const startTime = new Date().getTime();
          
            const result = await axios({method: 'post',
                    
                url: uploadUrl, 

                data,
                headers,
            });

            // console.log(`result: ${JSON.stringify(result)}`);

            oneResult.endTime = new Date().getTime();

        }else{

            oneResult.startTime = new Date().getTime();

            result = await axios({method: 'post',
                    
            url: 'https://www.virustotal.com/api/v3/files', 

            data,
            headers,
            });

            oneResult.endTime = new Date().getTime();
        }



        const id = result.data.data.id;

        const url2 = `https://www.virustotal.com/api/v3/analyses/${id}`;

        const result2 = await axios({method: 'get',
                    
            url: url2, 

            headers,
        });

        if(this.isAsync){

            this.scanInProgress =  this.scanInProgress - 1;
        }
        // console.log(`one end, in scan in progress: ${this.scanInProgress}`);
        console.log(`one end, in scan in progress: ${this.scanInProgress}`);

        this.statusText = `Ending scan #${this.scanInProgress}`;

        // console.log(`rawReponse2: ${JSON.stringify(result2)}`)

        // oneResult.result = result2;
        oneResult.rawResponses = result2;
        // oneResult.rawResponses = 'done';

        // console.log(`oneResult: ${JSON.stringify(oneResult)}`);

        oneResult.duration = (oneResult.endTime - oneResult.startTime)/1000;

        // this.scanLoading = false;
        this.gotResult = true;
        this.result = result;

        }catch(error){

        // this.scanLoading = false;
        this.gotError = true;
        this.error = error;
        console.log(`error: ${JSON.stringify(error)}`)
        }
    },
    

    getJsonObject(object){

        const links = JSON.parse(JSON.stringify(object.Links));

        return links;
    },

     calculateHighestDuration(cidObjects, refIndex){

         let index = 1;

          const calculateHighestDuration = this.calculateHighestDuration;          
          
          cidObjects.forEach(cidObject =>{

            //   console.log(`cidObject:${JSON.stringify(cidObject)}`);   

            if(refIndex == ''){

                // console.log(`index: ${index}`);

            }else{

                // console.log(`index: ${refIndex}-${index}`);
            }

            if(typeof cidObject.results != 'undefined'){

                if(cidObject.results.length > 0){

                    // console.log(` in if`);
                    // console.log(`duration: ${cidObject.results[0].duration}`);  

                    if(this.highestDuration < cidObject.results[0].duration){

                        this.highestDuration = cidObject.results[0].duration;
                    }

                    if(cidObject.cidObjects.length > 0){

                        calculateHighestDuration(cidObject.cidObjects, index+'');
                    }
                }
            }
            index = index + 1;
          });

          
      },

      calculateTotalDuration(cidObjects, refIndex){

         let index = 1;

          const calculateTotalDuration = this.calculateTotalDuration;          
          
          cidObjects.forEach(cidObject =>{

            //   console.log(`cidObject:${JSON.stringify(cidObject)}`);   

            if(refIndex == ''){

                // console.log(`index: ${index}`);

            }else{

                // console.log(`index: ${refIndex}-${index}`);
            }

            if(typeof cidObject.results != 'undefined'){

                if(cidObject.results.length > 0){

                    // console.log(` in if`);
                    // console.log(`duration: ${cidObject.results[0].duration}`);  

                    this.totalDuration = this.totalDuration + cidObject.results[0].duration;

                    // if(this.highestDuration < cidObject.results[0].duration){

                    //     this.highestDuration = cidObject.results[0].duration;
                    // }

                    if(cidObject.cidObjects.length > 0){

                        calculateTotalDuration(cidObject.cidObjects, index+'');
                    }
                }
            }
            index = index + 1;
          });

          
      },
  },

  data: function(){

    return{

        isAsync: false,
        statusText: '',        
        scanInProgress: 0,
        hash: '',
        // objectsLoaded: false,
        result: '',
        error: '',
        fileName:'',
        fileBuffer: null,
        file: null,
        fileContent: null,
        objectsLoading: false,

        scanIsFinished: false,
        scanLoading: false,
        gotResult: false,
        gotError: false,
        showDetails: false,
        startTime: 0,
        endTime: 0,
        duration: 0,
        content: null,
        allResults: [],
        cidObjects: [],
        objectsLoaded: false,
        highestDuration: 0,
        totalDuration: 0,

        defaultResult: [{"name":"css","rawResponses":"loading","cid":"QmfGiZfWLiwojshTJfEcTC51gUgnypWyrRLDUSfmFiDH2M","cidObjects":[{"cid":"QmXkQdFHuXqPGVpZELRDbmMY2WCedDscVVFj7MAmo6nUR4","name":"chunk-vendors.7e147ff3.css","rawResponses":"loading","cidObjects":[{"cid":"QmSnSJZ3aTXcFgzyWoMsRPjTiCnsi7C7RLsPYeVBT1YC8w","name":"","rawResponses":"loading","cidObjects":[]},{"cid":"QmccFeDGiKoJRsYs3LSviBJE8H4yoigBBoqQ4WSVisC12R","name":"","rawResponses":"loading","cidObjects":[]}]}]},{"name":"favicon.ico","rawResponses":"loading","cid":"QmaSyMrhp7Y1bgw5hRDCzwLMgf6piNhawkkVpwUgZ94d3Q","cidObjects":[]},{"name":"img","rawResponses":"loading","cid":"QmPw5nie3D79ZW2QL4U9ZTqz8g8j59NiUHaYF7s1on5PUQ","cidObjects":[{"cid":"QmcpXrneDVECadrJhjDnYD3d1yjx1cruN1ngZ8zbGrJQHA","name":"icons","rawResponses":"loading","cidObjects":[{"cid":"QmZZQiQ5Tct4Yp3nivDfAxifPdG1PprMQS6TpoxWVCr732","name":"android-chrome-192x192.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmWgEL4J2yWmXuZPE13woosXUn1TR9gm23KitjA4odKVnW","name":"android-chrome-512x512.png","rawResponses":"loading","cidObjects":[]},{"cid":"Qmdq8EWhHs1iqunC62G32ReEogZFNUimVL5zCZA7dPCNho","name":"android-chrome-maskable-192x192.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmcumNRkhVUjob7G7DZ9fbbdBxWSdV8hK585fTV934L5az","name":"android-chrome-maskable-512x512.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmaNvq1BuF7Ro58SHgf8W2XKfAszFeR6unWZWxRqx5q1Bo","name":"apple-touch-icon-120x120.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmV6HLNRoiGyW1ZVAGoEthrvkm2Bh4AS1UMCebyg7igXPT","name":"apple-touch-icon-152x152.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmRvkBvmrYswdHFupArAY8FZHUrkh5QMzHK9x1mc7pZuSD","name":"apple-touch-icon-180x180.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmQ9oeBpNFrmD968K7uyjG2qpowcTRN2bYLfMkUVNxjYQk","name":"apple-touch-icon-60x60.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmPt62RMp9arSKTVdY3uFGwCdMuVXdpVYeEfN1fpnvgrRL","name":"apple-touch-icon-76x76.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmUYcyyuTTcT7vzZvPsQx7MhSSUT5xKykeCb4BLtsjwUf7","name":"apple-touch-icon.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmPsrqGAzvxYk1wu9TVpUckmPW2fn8xrr2SGkSegn5EC4G","name":"favicon-16x16.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmfDtgRcbPcsvVqqkVP9V6tekjy1BfkEvxmo6YxKiwXR1T","name":"favicon-32x32.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmPWGJfNZxNe6fmpXSKEbCQtFLPohdvkyUCBgUqyS8rT2J","name":"msapplication-icon-144x144.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmYV29ZRv8S2og8iRV5a6PoKTABshXyp5LeX3MaURR9hGq","name":"mstile-150x150.png","rawResponses":"loading","cidObjects":[]},{"cid":"QmQbdsv9BPHPCXfgvfVnSDHUNBAdgXeVERgueF5kepkaw4","name":"safari-pinned-tab.svg","rawResponses":"loading","cidObjects":[]}]},{"cid":"QmYKn5fwQk13LB3gDLaDumYirSxXuGRfkaxqWKQnv7HL2Y","name":"logo.63a7d78d.svg","rawResponses":"loading","cidObjects":[]}]},{"name":"index.html","rawResponses":"loading","cid":"QmYaVVVru3NHCcXyP9JH76pqGLt3kWbDjVfnrHKoLSACKv","cidObjects":[]},{"name":"js","rawResponses":"loading","cid":"Qmd7SopiZ1onc71rVx9rkeZxc9M3TDpi7vM1Lq7qHfhvR6","cidObjects":[{"cid":"QmPRkDhdxsmfdPchLDaw6oka5AJadURa2quKCsqCXWByZ9","name":"app.72cda108.js","rawResponses":"loading","cidObjects":[]},{"cid":"QmSVPcF91nAULmXSyYMYQ2EJY59ogzwZSrnXBHpSfrxBid","name":"app.72cda108.js.map","rawResponses":"loading","cidObjects":[]},{"cid":"QmZf3u7JBxSNJ3D9QZi6n8Jz9scmy9wdHi8QpMtYVcW5EN","name":"chunk-vendors.40fd9281.js","rawResponses":"loading","cidObjects":[]},{"cid":"QmW1PgPP8U1ME6KytzoydrK5EwSJmNArwWk8emkm1cn1HW","name":"chunk-vendors.40fd9281.js.map","rawResponses":"loading","cidObjects":[{"cid":"QmSb9rPn49PNAV3tbUmQcEq5Nq1DkwzNKfvF7yNH3GH7s4","name":"","rawResponses":"loading","cidObjects":[]},{"cid":"QmNnwtxWj2zHg7yfxDbkpcxXUqU2yGXB3MGBo4PWJ6mNkn","name":"","rawResponses":"loading","cidObjects":[]},{"cid":"QmbQeyjHxjt7ysehFxvH2GpgS6ZnuStaQPey37RtTkSY5a","name":"","rawResponses":"loading","cidObjects":[]},{"cid":"QmVxnigY3QTH9nkndkZSKhbN2iM32HpaPv9XVX2cd8oDgw","name":"","rawResponses":"loading","cidObjects":[]}]}]},{"name":"manifest.json","rawResponses":"loading","cid":"QmVE4Z3it4LhKHFD8XHmPVxdWNnKiMgAVTKPje8wgD7GqJ","cidObjects":[]},{"name":"precache-manifest.fa3e5a0a707c59d6cb5944905e23b300.js","rawResponses":"loading","cid":"QmUAquSDJfpgRaZpYeB3NwA2nRTkho9bLvriBXrK11reBT","cidObjects":[]},{"name":"robots.txt","rawResponses":"loading","cid":"QmURdei4Wpwvx39zn2r7MNC8H2bZ3u1Ssky2oS7fRebJNc","cidObjects":[]},{"name":"service-worker.js","rawResponses":"loading","cid":"QmVtGfHgV5CxcCdwxRi7rdTWG3CRF31y3aEwXzWbuYXihW","cidObjects":[]}]
      
    }
  }
}
</script>

<style>

</style>