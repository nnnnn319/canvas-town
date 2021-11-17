<template>
    <div class="container">
        <div id="title">{{title}}</div>
        <div class="name-space">
            <label for="" id="name-label">你的名字:</label>
            <input type="text" name="name" v-model="name" id="username" placeholder="输入你的名字" @keyup.enter="onSubmit">
            <label for="" id="name-tip">{{Tip}}</label>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            title: '倒放挑战',
            name: "",
            Tip: ''
        }
    },
    methods: {
        onSubmit(){
            // 检查是否重复
            // url:/registerName
            // method: post
            /**
             * code here
             */
            let that = this
            this.$axios({
                url:'/users/registerName',
                method:'post',
                data:{username: this.name}
            }).then(res =>{
                let code = res.data.code
                if(code === 0){
                    console.log("注册成功")
                    // 前端保存
                    localStorage.setItem("name",this.name)
                    // 校验通过之后，进入gameHome
                    this.$router.push({
                        path: "/gameHome"
                    })
                }else{
                    that.Tip = res.data.msg
                }
            })
            
        }
    },
    computed: {
       
    }
}
</script>
<style>
/** 全局为flex布局 */
.container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
/* 倒放挑战 文字*/
.container #title{
    text-align: center;
    font-size: 200px;
    width: 100%;
}

/* 名字label + input */
.name-space{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 150px;
    width: 100%;
}

/** 你的名字 label */
.name-space #name-label{
    text-align: end;
    width: 50%;
    font-size: 50px;
}

/** 输入名字 input */
.name-space #username{
    width: 300px;
    height: 45px;
    padding: 10px;
    border-radius: 15px;
    font-size: 30px;
}
.name-space #name-tip{
    font-size: 20px;
    color: red;
}
</style>