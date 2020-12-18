<template>
  
    <v-layout class="mt-16 d-flex">
        
        <div>

        
            <div>
            <label>URL to scan:</label>
            </div>

            <div>
            <input v-model="url"
            type="text" placeholder="Enter URL" >
            </div>

            <div v-if="!loading">
            <v-btn @click="scanUrl"
            class="mt-10">
                submit</v-btn>
            </div>

            <div v-if="loading" class="mt-10">
                
            <label>loading ...</label>

            </div>

            
            <div v-if="cidObjects.length > 0 && objectsLoading == true" class="mt-5">

                <div class="detailsBorder mt-10" v-for="(cidObject, index) in cidObjects" :key="index">

                    <!-- <url-scan-object :cid="cid" :name="names[index]" :index="index"
                    :showResults="showResults[index]" :rawResponses="rawResponses[index]"></url-scan-object> -->

                    <url-scan-object :cid="cidObject.cid" :name="cidObject.name" :index="index+1" :cidObject="cidObject"
                    :showResults="cidObject.showResults" :rawResponses="cidObject.rawResponses"></url-scan-object>

                    <!-- <div v-for=""> -->

                    <!-- </div> -->
                    
                    <!-- <div class="mt-2">
                        
                        <label>#{{index}} cid: {{cid}}</label>
                    </div>

                    <div class="mt-2 mb-2">
                        
                        <label>#{{index}} name: {{names[index]}}</label>
                    </div>
                    
                    <div class="mb-4">

                        <v-btn @click="changeShowResult(index)">
                            <label v-if="showResults[index]  == true">Close</label> 
                            <label velse> Show Result </label>
                            </v-btn>

                    </div>
                    <div style="width: 200px;" v-if="showResults[index]" class="mt-2" :key="rawResponses[index]">

                        <label>result: {{rawResponses[index]}}</label>
                    </div>  -->

                </div>
            </div>

            <div v-else-if="gotResult" class="mt-10" :key="cids.length">

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

                <div class="mt-5">
                    
                    <label>result {{result.result2}}</label>
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

            <div class="mt-10 mb-10">

             <v-btn @click="printToConsole" class="mt-10">Print to console</v-btn>
            </div>

            <div v-if="highestDuration != 0" class="mt-10 mb-10">

             <label> Duration: {{highestDuration}}</label>
            </div>
        </div>            
    </v-layout>
</template>

<script>

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';

import urlScanObject from './UrlScanObject'

import axios from 'axios'

import vue from 'vue'

// import parser from 'fast-xml-parser'
// import parser from 'xml2js'

import  ipfsClient from  'ipfs-http-client'

const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });




// import FormData from 'form-data'

export default {

      components: {
    // HelloWorld
    VueJsonPretty,
    urlScanObject
  },

  methods:{

      printToConsole(){
          
          this.calculateHighestDuration(this.cidObjects);

          console.log(JSON.stringify(this.cidObjects));

          console.log(`highest duration: ${this.highestDuration}`);
      },

      calculateHighestDuration(cidObjects){

          const calculateHighestDuration = this.calculateHighestDuration;
          cidObjects.forEach(cidObject =>{

            if(this.highestDuration < cidObject.duration){

                this.highestDuration = cidObject.duration;
            }

            if(cidObject.cidObjects.length > 0){

                calculateHighestDuration(cidObject.cidObjects);
            }
          })
      },

    changeShowResult(index){
    
    let newValue  =  !this.showResults[index];
    vue.set(this.showResults, index, newValue);
    // console.log(`showResults: ${JSON.stringify(this.showResults)}`)
    },

    async scanUrl(){

      this.loading = true;
      this.gotResult = false;
      this.gotError = false;

      const url = this.url;
    //   console.log(`in scanUrl with:${this.url}`)

      try{

        if(url.includes('https://ipfs.io/ipfs'))
        {
            // console.log(`url.includes('https://ipfs.io/ipfs'`)
            this.scanIpfsUrl(url);
        }
        else
        {

        console.log(`!!! url.includes('https://ipfs.io/ipfs'`)
            
        // return;
        const result = await axios({method: 'post',
              
          url: '/api/scanUrl', 

          form: {

            url: this.url
        }});

        this.loading = false;
        this.gotResult = true;

        this.result = result.data;

        //POST /urls/{id}/analyse
        console.log(`result: ${JSON.stringify(result.data)}`);
        }
      
      }catch(error){

        this.loading = false;
        this.gotError = true;
        this.error = error;
        console.log(`error: ${error}`)
      }
    },

   async scanIpfsUrl(url){

        try{
            
            // console.log(`url: ${url}`);

            // const cid = 'QmUrFVdDYGj5ZkpvcKNpJSmnmkV1EoDQkTu1THHQS63ten';
            const urlArray = url.split('/');
            // console.log(`urlArray: ${JSON.stringify(urlArray)}`);


            let lastValue = urlArray[urlArray.length - 1];

            if(lastValue == ''){

             lastValue = urlArray[urlArray.length - 2];

                // console.log(`lastValue: ${lastValue}`);
            }

            const cid = lastValue;

            // console.log(`cid: ${cid}`);

            // return;

            // const blockStats = await ipfs.block.stat(cid);
            // console.log(`blockStats: ${JSON.stringify(blockStats)}`);
            
            // const blockGet = await ipfs.block.get(cid);

            // const objectStat = await ipfs.object.stat(cid);
            // console.log(`objectStat: ${JSON.stringify(objectStat)}`);
            
            const objectGet = await ipfs.object.get(cid);
            // console.log(`objectGet: ${JSON.stringify(objectGet)}`);

            /*
            const objectGetLinks = this.getJsonObject(objectGet);
            console.log(`objectGetLinks: ${JSON.stringify(objectGetLinks)}`);
            
            // const oneBlockGet = await ipfs.block.get('QmfGiZfWLiwojshTJfEcTC51gUgnypWyrRLDUSfmFiDH2M');
            // console.log(`oneBlockGet: ${JSON.stringify(oneBlockGet)}`);               
            const oneObjectGet1 = await ipfs.object.get('QmfGiZfWLiwojshTJfEcTC51gUgnypWyrRLDUSfmFiDH2M');
            // console.log(`oneObjectGet1: ${JSON.stringify(oneObjectGet1)}`);  
            const objectGet1Links = this.getJsonObject(oneObjectGet1);
            console.log(`objectGet1Links: ${JSON.stringify(objectGet1Links)}`);  

            const oneObjectGet2 = await ipfs.object.get('QmXkQdFHuXqPGVpZELRDbmMY2WCedDscVVFj7MAmo6nUR4');
            // console.log(`oneObjectGet2: ${JSON.stringify(oneObjectGet2)}`);  
            const objectGet2Links = this.getJsonObject(oneObjectGet2);
            console.log(`objectGet2Links: ${JSON.stringify(objectGet2Links)}`);  


            const oneObjectGet31 = await ipfs.object.get('QmSnSJZ3aTXcFgzyWoMsRPjTiCnsi7C7RLsPYeVBT1YC8w');
            // console.log(`oneObjectGet31: ${JSON.stringify(oneObjectGet31)}`);  
            const objectGet31Links = this.getJsonObject(oneObjectGet31);
            console.log(`objectGet31Links: ${JSON.stringify(objectGet31Links)}`);  

            const oneObjectGet32 = await ipfs.object.get('QmccFeDGiKoJRsYs3LSviBJE8H4yoigBBoqQ4WSVisC12R');
            // console.log(`oneObjectGet32: ${JSON.stringify(oneObjectGet32)}`);  
            const objectGet32Links = this.getJsonObject(oneObjectGet32);
            console.log(`objectGet32Links: ${JSON.stringify(objectGet32Links)}`);  
            */

            
            // console.log(`just links: ${objectGet.Links}`);               
            // console.log(`objectGet.links: ${JSON.stringify(objectGet.Links)}`);  
            
            // const links = JSON.parse(JSON.stringify(objectGet.Links));
            // console.log(`links: ${(links[0])}`);  
            // console.log(`links: ${JSON.stringify(links)}`);  


            const links = this.getJsonObject(objectGet);
            // console.log(`links: ${JSON.stringify(links)}`);  
            // return;
            this.cidObjects =  new Array(links.length);
            
            // this.rawResponses = new Array(links.length);
            // this.cids = new Array(links.length);
            // this.names = new Array(links.length);
            // this.showResults = new Array(links.length);
            // this.startTimes= new Array(links.length);
            // this.endTimes= new Array(links.length);


            // console.log(`cidObjects: ${JSON.stringify(this.cidObjects)}`);

            // console.log(`showResults: ${JSON.stringify(this.showResults)}`);

            // console.log(`rawResponses: ${JSON.stringify(this.rawResponses)}`);

            for(let i = 0; i < links.length; i++){

                this.cidObjects[i] = {};

                // console.log(`before .name`);
                this.cidObjects[i].name = links[i].name;

                this.cidObjects[i].rawResponses = 'loading';
                // console.log(`after .name`);


                this.cidObjects[i].cid = links[i].cid;
                
                await this.addFirstCidOjbects(this.cidObjects[i], i);    
            }

            this.objectsLoading = true;

            // console.log(`this.cidObjects: ${JSON .stringify(this.cidObjects)}`);
             
           this.callingPartialVirusApiCall(this.cidObjects);


            // const partialVirusApiCall = this.partialVirusApiCall

            //  links.forEach(link => {
                 
            //      console.log(`link.cid: ${link.cid}`);

            //      partialVirusApiCall(link.cid);
            //  });



            // console.log(`jsonObj: ${JSON.stringify(jsonObj)}`);   

            // var jsonObj = parser.parse(JSON.stringify(objectGet.Links),{});
            // const jsonObj = parser.parseString(objectGet.Links);
            // console.log(`jsonObj: ${JSON.stringify(jsonObj)}`);   
            // const parser = new DOMParser();
            // const xmlDoc = parser.parseFromString(`${objectGet.Links}`,"text/xml");
            // console.log(`xmlDoc: ${JSON.stringify(xmlDoc)}`);               

            // const linksObject = JSON.parse(objectGet.Links);
            // console.log(`linksObject: ${JSON.stringify(linksObject)}`);               

             
            // console.log(`links.keys: ${Object.keys(links[0])}`);               

            // console.log(`links.Name: ${JSON.stringify(links[0].Name)}`);
            // console.log(`links.Hash.keys: ${Object.keys(links[0].Hash)}`);               
            // console.log(`links.Hash: ${JSON.stringify(links[0].Hash.multihash)}`);               
            
            //  links.array.forEach(link => {
                 
            //      console.log(`link.cid: ${link.cid}`)
            //  });
            // const ipfsRefs = await ipfs.refs('QmUrFVdDYGj5ZkpvcKNpJSmnmkV1EoDQkTu1THHQS63ten', {recursive: true});
            // const ipfsRefs = await ipfs.refs.local();
            // console.log(`ipfs: ${JSON.stringify(ipfsRefs)}`);

            // const ipfsLS = await ipfs.ls('QmUrFVdDYGj5ZkpvcKNpJSmnmkV1EoDQkTu1THHQS63ten');
            // console.log(`ipfsLS: ${JSON.stringify(ipfsLS)}`);               

            // const test =  await ipfs.dht.findProvs('QmUrFVdDYGj5ZkpvcKNpJSmnmkV1EoDQkTu1THHQS63ten');
            // const test =  await ipfs.ipfs.ipfs.findProvs('QmUrFVdDYGj5ZkpvcKNpJSmnmkV1EoDQkTu1THHQS63ten');

            // const test = ipfs.ipfs.findProvs('QmUrFVdDYGj5ZkpvcKNpJSmnmkV1EoDQkTu1THHQS63ten')
            // console.log(`test: ${test.toString()}`);

            // console.log(` after dht`);

            let i = 1;

            // for (const { cid } of results) {
            // // CID (Content IDentifier) uniquely addresses the data
            // // and can be used to get it again.
            // console.log(`#${i} ${cid.toString()}`)
            // i = i + 1;
            // }
        
        }catch(error){

            this.loading = false;
            this.gotError = true;
            this.error = error;
            this.objectsLoading = false;
            console.log(`error: ${error}`)
        }
    },

    async virusApiCall(){

        this.loading = true;
        this.gotResult = false;
        this.gotError = false;

        console.log(`key:${process.env.VUE_APP_VIRUSTOTAL_KEY}`)

        let data = new FormData();
        
        data.append('url', this.url);

        const headers= {
        'x-apikey': process.env.VUE_APP_VIRUSTOTAL_KEY,
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',

        }

        console.log(`data: ${JSON.stringify(data)}`)
        console.log(`headers:${JSON.stringify(headers)}`);
        console.log(`url:${this.url}`);


        try{


        const result = await axios({method: 'post',
                    
            url: 'https://www.virustotal.com/api/v3/urls', 

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
        
        // console.log(`rawReponse2: ${JSON.stringify(result2)}`)


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

    callingPartialVirusApiCall(cidObjects){

        for(let i = 0; i < cidObjects.length; i++){
                
            this.partialVirusApiCall(cidObjects[i], i);

            if(cidObjects[i].cidObjects.length > 0){

                this.callingPartialVirusApiCall(cidObjects[i].cidObjects);
            }
        }
    },

    // async partialVirusApiCall(cidObjects, index){
    async partialVirusApiCall(cidObject, index){

        // console.log(``)
        // this.cids[index] = cid;
        
        const url = `https://ipfs.io/ipfs/${cidObject.cid}`;
        this.loading = true;
        this.gotResult = false;
        this.gotError = false;

        let data = new FormData();
        
        data.append('url', url);

        const headers= {
        'x-apikey': process.env.VUE_APP_VIRUSTOTAL_KEY,
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',
        }

        // console.log(`data: ${JSON.stringify(data)}`)
        // return;
        // console.log(`headers:${JSON.stringify(headers)}`);
        // console.log(`url:${url}`);

        try{

            // this.startTimes[index] = new Date().getTime();
            cidObject.startTime = new Date().getTime();
            const result = await axios({method: 'post',
                        
                url: 'https://www.virustotal.com/api/v3/urls', 

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

        // this.endTimes[index] = new Date().getTime();        
        cidObject.endTime = new Date().getTime();

        cidObject.duration = (cidObject.endTime - cidObject.startTime)/1000;
        
        // console.log(`id:${index} => rawReponse: ${JSON.stringify(result2)}`)

        // this.rawResponses[index] = JSON.stringify(result2);
        // vue.set(this.rawResponses, index, JSON.stringify(result2));

        // console.log(`before cidObject:${JSON.stringify(cidObject)}`);
        cidObject.rawResponses = JSON.stringify(result2);
        // console.log(`after cidObject:${JSON.stringify(cidObject)}`);

        // console.log(`index: ${index} && cidObject.rawResponses: ${cidObject.rawResponses}}`)
            
        this.loading = false;
        // this.gotResult = true;
        this.result = result;

        // this.result = result.data;

        // console.log(`result: ${JSON.stringify(result.data)}`);
        }catch(error){

        this.loading = false;
        this.gotError = true;
        this.error = error;
        vue.set(this.rawResponses, index, error);

        // console.log(`error: ${JSON.stringify(error)}`)
        }
    },

    getJsonObject(object){

        const links = JSON.parse(JSON.stringify(object.Links));

        return links;
    },

    async addFirstCidOjbects(object, index){

        let linkExists = false;
        // console.log(`in addFirstCidOjbects, cid: ${object.cid}`);
        const objectGet = await ipfs.object.get(object.cid);

        // console.log(`in addFirstCidOjbects #: ${index}, objectGet: ${JSON.stringify(objectGet)}`);

        const links = this.getJsonObject(objectGet);

        // console.log(`in addFirstCidOjbects #: ${index}, links: ${JSON.stringify(links)}`);

        if( JSON.stringify(links) == '[]'){

            // object.cidObjects = {};
            object.cidObjects = new Array(0);
            // object.cidObjects.cid = '';
            // object.cidObjects.name = '';
            // object.cidObjects.rawResponses = 'loading';


            // object.cidObjects = links;
            // console.log(`links is empty`);
        }else{

            linkExists = true;
            // console.log(`links exists`);
        }

        if(linkExists == true){

            //   for(let i = 0; i < links.length; i++){

            //     this.cidObjects[i] = {};

            //     this.cidObjects[i].name = links[i].name;
            //     this.cidObjects[i].cid = links[i].cid;
                
            //     await this.addFirstCidOjbects(this.cidObjects[i], i);    
            // }

            // console.log(`Before, objects: ${JSON.stringify(this.cidObjects)}`)

            object.cidObjects = new Array(links.length);

             if(index == 0){

                // console.log(`between, objects: ${JSON.stringify(this.cidObjects)}`)
            }



            for(let i = 0; i < links.length; i++){

                object.cidObjects[i] = {};

                object.cidObjects[i].cid = links[i].cid;
                object.cidObjects[i].name = links[i].name;
                object.cidObjects[i].rawResponses = 'loading';

                await this.addSecondCidObjects(object.cidObjects[i], index, i);
            }


            // if(index == 0){

            //     //  console.log(`iindex: ${index}`);

            //     for(let i = 0; i < links.length; i++){

            //     object.cidObjects[i] = {};

            //     object.cidObjects[i].cid = links[i].cid;
            //     object.cidObjects[i].name = links[i].name;

            //     await this.addSecondCidObjects(object.cidObjects[i], index, i);
            // }

                // console.log(`after, objects: ${JSON.stringify(this.cidObjects)}`)
            // }
        }
    },

    async addSecondCidObjects(object, previousIndex, index){

        // console.log(`index : ${index}`);
        // if(previousIndex != 0){

        //     console.log(`return`);
        //     return;
        // }
        // console.log(`in addSecondCidObjects, object: ${JSON.stringify(object)}`);

        // console.log(`in addSecondCidObjects, cid: ${object.cid}`);

        let linkExists = false;
        // console.log(`in addFirstCidOjbects: ${JSON.str}`)
        const objectGet = await ipfs.object.get(object.cid);

        // console.log(`in addSecondCidObjects #: ${index}, objectGet: ${JSON.stringify(objectGet)}`);

        const links = this.getJsonObject(objectGet);

        // console.log(`in addSecondCidObjects #: ${previousIndex} ${index}, links: ${JSON.stringify(links)}`);

        if( JSON.stringify(links) == '[]'){
            
            // object.cidObjects = {};
            object.cidObjects = new Array(0);
            // object.cidObjects.cid = '';
            // object.cidObjects.name = '';

            // console.log(`just in: ${JSON.stringify(this.cidObjects)}`);

            // object.cidObjects = links;
            // console.log(`links is empty`);
        }else{

            linkExists = true;
            // console.log(`links exists`);

            // console.log(`objects before: ${JSON.stringify(this.cidObjects)}`);
            // console.log(`objects before: ${JSON.stringify(object)}`);

            object.cidObjects = new Array(links.length);

            // console.log(`objects after: ${JSON.stringify(this.cidObjects)}`);
            // console.log(`objects after: ${JSON.stringify(object)}`);

            for(let i = 0; i < links.length; i++){

                const newPreviousIndex = `${previousIndex}${index}`;

                object.cidObjects[i] = {};

                object.cidObjects[i].cid = links[i].cid;
                object.cidObjects[i].name = links[i].name;
                object.cidObjects[i].rawResponses = 'loading';

               await this.addSecondCidObjects(object.cidObjects[i], newPreviousIndex, i);
            }
        }

        // if(linkExists){

        //     for(let i = 0; i < links.length; i++){

        //     this.addSecondCidObjects(links, index);

        //     }
        // }
    },
  },

  data: function(){

    return{

        highestDuration: 0,
        
        // cidObject: {

        //     cid,
        //     name,
        //     hash,
        //     links,
        //      rawResponse,
        // },

        url: '',
        result: '',
        error: '',
        objectsLoading: false,
        loading: false,
        gotResult: false,
        gotError: false,
        showDetails: false,
        cidObjects: [],
        showResults: [],
        names:[],
        cids: [],
        rawResponses: [],
        startTimes:[],
        endTimes:[],
    }
  }
}
</script>

<style>

.detailsBorder{

  /* border-top: 4px dotted blue; */
  border-bottom: 10px dotted blue;


}
</style>