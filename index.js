function pow(a, b){
    return Math.pow(a, b)
}

function sqrt(a){
    return Math.sqrt(a)
}

// 开发一个弹幕算法
var container = document.querySelector(".danmaku-box")
var DanmakuBoxHeight = parseInt(getComputedStyle(container).height)
// var DanmakuBoxHeight = 100
var LoveHeight = 200

// 创建一个二维运动的弹幕class
const clientWidth = document.body.clientWidth
const clientHeight = document.body.clientHeight
// console.log(clientHeight)

// 定义初始位置
var startTop = clientHeight/2 + LoveHeight/2
// 中心位置
var centerX = clientWidth/2, centerY = clientHeight/2

const wordDefaultStyles = {
    fontSize:"25px",
    color:"#4154af",
    position:"absolute",
    whiteSpace:"nowrap",
}

function addStylesToElement(element, styles){
    for(let o in styles){
        element.style[o] = styles[o]
    }
    return true
}

function Word(content, styles){
    if(!(this instanceof Word)){
        return new Word(content, styles)
    }
    this.content = content
    this.styles = styles || wordDefaultStyles
    this.top = 0
    this.left = clientWidth
    this.contentWidth = parseInt(this.styles.fontSize)*this.content.length
    this.ScreenWidth = clientWidth + this.contentWidth
    // 用于垂直判断标志
    this.vertical = true
    // 系数k
    this.k =  8 * Math.PI/ this.ScreenWidth
    // leftback
    this.leftback = false
    this.rightback = false
    // change
    this.leftlabel = false
    this.rightlabel = false
    this.counter = 0
}

Word.prototype.create = function(){
    var div = document.createElement('div')
    div.innerHTML = this.content
    addStylesToElement(div, this.styles)
    div.style.left = clientWidth + 'px'
    div.style.top = startTop + 'px'
    // div.style.top = '0px'
    this.div = div
    container.append(div)
    this.contentHeight = parseInt(getComputedStyle(this.div).height)
    // console.log(this.k)
    return this
}

Word.prototype.move = function(speed){
    this.speed = speed || 1
    var timer = setInterval(()=>{
        // 一旦离开窗口就会销毁这条弹幕
        // console.log()
        this.x = clientWidth - parseInt(this.div.style.left)
        if(parseInt(this.div.style.left) < -this.contentWidth){
            clearInterval(timer)
            // 立马销毁
            container.removeChild(this.div)
        }else{
            // 判断是不是返回
            if(!this.leftback || this.rightback){
                this.div.style.left = parseInt(this.div.style.left) - this.speed + 'px'
            }else{
                this.div.style.left = parseInt(this.div.style.left) + this.speed + 'px'
            }
            // 反弹效果
            // if(this.vertical){
            //     this.div.style.top = parseInt(this.div.style.top) + this.speed + 'px'
            // }else{
            //     this.div.style.top = parseInt(this.div.style.top) - this.speed + 'px'
            // }
            // 正弦曲线
            // this.div.style.top = (1 + Math.sin(this.x*this.k))*(DanmakuBoxHeight - this.contentHeight)/2 + 'px'

            // 心形曲线
            if(this.x > centerX && this.rightlabel){
                var dx = this.x - centerX
                dx = dx/LoveHeight
                if(this.leftback){
                    if(pow(dx, 4/3)-4*(pow(dx, 2)-1) > 0){
                        var _height = (pow(dx, 2/3)+sqrt(pow(dx, 4/3)-4*(pow(dx, 2)-1)))/2
                        _height = _height*LoveHeight
                        this.div.style.top = startTop - _height-LoveHeight+ 'px'
                    }else{
                        this.leftlabel = true
                    }
                }else{
                    if(pow(dx, 4/3)-4*(pow(dx, 2)-1) > 0){
                        var _height = (pow(dx, 2/3)-sqrt(pow(dx, 4/3)-4*(pow(dx, 2)-1)))/2
                        _height = _height*LoveHeight
                        this.div.style.top = startTop - _height-LoveHeight+ 'px'
                    }else{
                        this.leftback = true
                    }
                }
            }
            if(this.x < centerX && this.leftlabel){
                var dx = centerX - this.x
                dx = dx/LoveHeight
                if(this.rightback){
                    if(pow(dx, 4/3)-4*(pow(dx, 2)-1) > 0){
                        var _height = (pow(dx, 2/3)-sqrt(pow(dx, 4/3)-4*(pow(dx, 2)-1)))/2
                        _height = _height*LoveHeight
                        this.div.style.top = startTop - _height-LoveHeight+ 'px'
                    }
                }else{
                    if(pow(dx, 4/3)-4*(pow(dx, 2)-1) > 0){
                        var _height = (pow(dx, 2/3)+sqrt(pow(dx, 4/3)-4*(pow(dx, 2)-1)))/2
                        _height = _height*LoveHeight
                        this.div.style.top = startTop - _height-LoveHeight+ 'px'
                    }else{
                        this.rightback = true
                    }
                }
            }
            if(this.x === centerX){
                this.counter = this.counter + 1
                if(this.counter === 1){
                    this.rightlabel  = true
                }
                if(this.counter === 3){
                    this.leftlabel = false
                    this.rightlabel = false
                }
            }
        }
        // 反弹效果
        // else if(parseInt(this.div.style.top) > DanmakuBoxHeight - this.contentHeight){
        //     // clearInterval(timer)
        //     // container.removeChild(this.div)
        //     this.div.style.top = parseInt(this.div.style.top) - this.speed + 'px'
        //     this.vertical = false
        // }else if(parseInt(this.div.style.top) < 0){
        //     this.div.style.top = parseInt(this.div.style.top) + this.speed + 'px'
        //     this.vertical = true
        // }
    }, 10)
}

Word.prototype.run = function(){
    var content = this.content
    function anls(index){
        var word = content[index]
        // console.log(word)
        if(word){
            Word(word).create().move()
            setTimeout(()=>{
                anls(index+1)
            }, 250)
        }else{
            return
        }
    }
    anls(0)
}

var openbutton = document.querySelector('#openbutton')
openbutton.onclick = function(){
    Word('傻她你呀是这个世界上最最最最最卡哇伊的傻她你呀是这个世界上最最最最最卡哇伊的傻她你呀是这个世界上最最最最最卡哇伊的').run()
}




// const openbutton = document.querySelector('#openbutton')

