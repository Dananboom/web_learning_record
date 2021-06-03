function createSlide(){
    const slide = document.createElement('div')
    slide.style.position = 'absolute'
    slide.style.left = '0'
    slide.style.top = '0'
    slide.style.height = '100%'
    slide.style.display = 'flex'
    return slide
}

function bindImages(slide, imgs, width){
    const newImgs = [...imgs, imgs[0]]
    newImgs.forEach(url => {
        const img = document.createElement('img')
        img.src = url
        img.style.width = width + 'px'
        slide.appendChild(img)
    })
}

function Bunner(dom, imgs){
    dom.style.position = 'relative'
    dom.style.overflow = 'hidden'

    this.slide = createSlide() 
    bindImages(this.slide, imgs, dom.offsetWidth)
    dom.appendChild(this.slide)

    this.index = 0
    this.length = imgs.length
    this.width = dom.offsetWidth
}

Bunner.prototype.next = function(speed = 1){
    if(this.index === this.length){
        this.index = 0
        this.slide.style.left = 0 + 'px'
    }
    this.index++
    const initial = this.slide.offsetLeft
    let left = 0
    const timer = setInterval(()=>{
        left += Math.ceil((this.width - left) / 50 * speed)
        if(left >= this.width){
            clearInterval(timer)
            this.slide.style.left = (initial - this.width) + 'px'
        } else {
            this.slide.style.left = (initial - left) + 'px'
        }
    },1)
}

Bunner.prototype.prev = function(speed = 1){
    if(this.index === 0){
        this.index = this.length
        this.slide.style.left = this.length * this.width + 'px'
    }
    this.index--
    const initial = this.slide.offsetLeft
    let left = 0
    const timer = setInterval(()=>{
        left += Math.ceil((this.width - left) / 50 * speed)
        if(left >= this.width){
            clearInterval(timer)
            this.slide.style.left = (initial + this.width) + 'px'
        } else {
            this.slide.style.left = (initial + left) + 'px'
        }
    },1)
}

Bunner.prototype.play = function(time = 1000){
    if(this.timer){
        clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
        this.next()
    }, time)
}

Bunner.prototype.stop = function(){
    if(this.timer){
        clearInterval(this.timer)
    }
    this.timer = null
}