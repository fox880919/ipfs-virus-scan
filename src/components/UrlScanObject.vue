<template>
  
  <v-layout>
    
    <div>
      <div class="mt-2">
                        
            <label>#{{index}} cid: {{cidObject.cid}}</label>
        </div>

        <div class="mt-2 mb-2">
            
            <label>#{{index}} name: {{cidObject.name}}</label>
        </div>
        
        <div class="mb-4">

            <v-btn @click="localShowResult=!localShowResult">

                <label v-if="localShowResult  == true">Close</label> 
                <label v-else> Show Result </label>
                </v-btn>

        </div>
        <div style="width: 200px;" v-if="localShowResult" class="mt-2">

            <label>result: {{cidObject.rawResponses}}</label>
        </div>

        <div class="ml-5" v-if="typeof cidObject.cidObjects != 'undefined'">

            <div v-if="cidObject.cidObjects.length>0">

                <div v-for="(newCidObject, i) in cidObject.cidObjects" :key="i">
                    
                    <!-- <label>{{newCidObject}}</label> -->
                    <url-scan-object :cidObject="newCidObject" :index="`${index}-${i+1}`"/>
                </div> 
            </div>    
        </div>

    </div>
  </v-layout>
</template>

<script>

// import urlScanObject from './tempComponent'

export default {

    name: "urlScanObject",

    mounted(){


        // console.log(`rawResponses: ${JSON.stringify(this.rawResponses)}`)
    },
    
    props:{

        index: '',

        // cid: 0,

        // name: '',

        // showResults: false,

        // rawResponses: '',

        cidObject: {
            
            type: Object
        }
    },

    // components:{

    //     urlScanObject
    // },

    methods:{

    },

    data: function(){

        return{

            localShowResult: false,
        }
    }

}
</script>

<style>

</style>