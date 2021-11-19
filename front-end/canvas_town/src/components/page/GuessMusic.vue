<template>
    <div class="guess-music-container">
        <!-- 冲关挑战！-->
        <p id="music-index"  v-show="!showBegin">当前第{{music_index + 1}}题</p>
        <p id="music-index"  v-show="!showBegin">倒计时{{nowtime}}秒</p>
        <div class="total-show" v-show="!showBegin">当前分数：{{now_total}}分</div>
        <div class="music-container">音乐展示区域</div>
        <div class="audio-container">播放器位置</div>
        <div class="option-container">
            
            <b-button id="gameStart" variant="outline-primary" v-show="showBegin" @click="gameStart">开始游戏</b-button>
            
            
            <b-button v-for="answer of answer_list" v-bind:key="answer.id" class="option" v-show="!showBegin" variant="outline-primary" @click="choose(answer.name)">{{answer.name}}</b-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            showBegin: true,
            musicList:[
                {
                    name: '青花瓷',     // 正确答案    
                    addr:'青花瓷.mp4',  // 音频地址
                    total: 20           // 分数
                },
                {
                    name: '红昭愿',     // 正确答案    
                    addr:'红昭愿.mp4',  // 音频地址
                    total: 10           // 分数
                },
                {
                    name: '等你下课',     // 正确答案    
                    addr:'等你下课.mp4',  // 音频地址
                    total: 10           // 分数
                },
                {
                    name: '稻香',     // 正确答案    
                    addr:'稻香.mp4',  // 音频地址
                    total: 10           // 分数
                }
            ],
            // 当前播放的歌曲
            music_now: {
                name: '青花瓷',
                addr: '青花瓷.mp4',
                total: 10
                },
            // 
            answer_list : [
                {
                    id: 1,
                    value: '青花瓷'
                },
                {
                    id: 2,
                    value: '红昭愿'
                },
                {
                    id: 3,
                    value: '稻香'
                },
                {
                    id: 4,
                    value: '等你下课'
                },
            ],
            // 当前分数
            now_total: 0,
            // 当前歌曲的index
            music_index: 1,
            intervalId : 0,
            // 当前倒计时
            nowtime: 30,
            // 目标倒计时
            time: 0,
        }
    },
    mounted(){
        console.log('进入方法')
        let that = this
        // 渲染前获取数据
        this.$axios({
            url: '/getMusicList',
            method: 'get'
        }).then((res) => {
            let code = res.data.code
            if(code === 0){
                // 请求成功
                this.musicList = res.data.data
                this.$message.success(`请求歌曲列表成功`)
            }else{
                this.$message.error(`请求歌曲列表失败！请检查网络连接`)
                that.$router.push({
                    path:'/gameHome'
                })
            }            
        })
    },
    methods:{
        choose(option){
            // 点击选项事件
            console.log(`you choosed option ${option}`)
            if(option === this.music_now.name){
                // 答对
                this.$message.success(`您答对了！获取了${this.music_now.total}分！`)
                this.now_total += this.music_now.total
            }else{
                 this.$message.error(`很遗憾，您答错了,再接再厉！`)
            }
            this.ifAnswer = true
        },
        gameStart(){
            // 设置倒计时
            this.time = 0
            // 设置当前事件
            this.nowtime = 10
            // 设置当前还未答题
            this.ifAnswer = false
            // 当前有歌
            if(this.musicList.length > 0){
                // 获取第一首歌曲
                this.music_now = this.musicList[0] 
                // 当前播放第1首歌曲
                this.music_index = 0
                // 设置答案
                this.resetAnswer(this.music_index)
                // 设置每秒定时
                this.intervalId = setInterval(this.judgeContinue,1000)
                // 展示标签
                this.showBegin = false
            }else{
                alert('获取题目失败!')
                this.$router.push({
                    name:"gameHome"
                })
            }
        },
        judgeContinue(){
            console.log(`倒计时${this.nowtime}`)
            console.log(`当前第${this.music_index + 1}首歌`)
            // 判断是否继续
            if(this.nowtime > this.time && this.ifAnswer === false){
                // 倒计时没有到且还未答题
                // 倒计时 - 1
                this.nowtime = this.nowtime - 1
            }else{
                this.music_index = this.music_index + 1
                if(this.music_index < this.musicList.length){
                    // 未到最后一个歌
                    // 设置到下一首歌
                    this.music_now = this.musicList[this.music_index]
                    // 刷新答案
                    this.resetAnswer(this.music_index)
                    // 设计倒计时
                    this.nowtime = 10
                    this.ifAnswer = false
                }else{
                    this.gameOver()
                }
            }
        },
        gameOver(){
            // 关闭游戏循环
            window.clearInterval(this.intervalId)
            // 统计分数
            alert(`您共获得了${this.now_total}分`)
            this.$router.push({
                    path:'/gameHome'
                })
        },
        resetAnswer(music_index){
            let newAnswer = []
            // 导入正确答案
            newAnswer.push(this.musicList[music_index])
            // 挑选正确答案之外的其他三个index
            let a = music_index
            let b = music_index
            let c = music_index
            a = (a+1)%(this.musicList.length - 1)
            b = (b+3)%(this.musicList.length - 1)
            c = (c+4)%(this.musicList.length - 1)
            // 加入三个答案
            newAnswer.push(this.musicList[a])
            newAnswer.push(this.musicList[b])
            newAnswer.push(this.musicList[c])
            // 打乱
            newAnswer.sort(function() {
                return (0.5-Math.random());
            });
            // 重置答案
            this.answer_list = newAnswer;
        },
    },
    
}
</script>
<style>
.guess-music-container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.total-show{
    width: 100%;
    text-align: center;
}

.music-container{
    width: 100%;
    height: 500px;
    margin: 0 20% 0 20%;
    background-color: gray;
}

.audio-container{
    width: 100%;
    margin: 0 20% 0 20%;
    text-align: center;
}

.option-container{
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.option{
    width: 30%;
    height: 50px;
    margin: 2.5% 10% 2.5% 10%;
}

#gameStart{
    width: 50%;
    height: 50px;
    margin-top: 100px;
    border-radius: 20px;
}

#music-index{
    width: 100%;
    text-align: center;
    font-size: 25px;
}
</style>