<template>
  
    <div>

        <url-scan-object :cidObject="cidObject"/>
    </div>
</template>

<script>

import urlScanObject from './UrlScanObject';
export default {

    props:{

        cidObject:{

            type: Object
        }
    },

    components:{

        urlScanObject 
    }
}
</script>

<style>

</style>