<template>
    <div class="container">
        <div>{{title}}</div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            title: '倒放挑战'
        } 
    }
}
</script>
<style>
.container{
    display: flex;
    flex-direction: row;
}
.container div{
    justify-content: center;
    align-items: center;
    font-size: 200px;
}
</style>