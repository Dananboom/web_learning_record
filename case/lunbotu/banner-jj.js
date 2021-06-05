const Banner = function() {
    function creatSlide() {
        const slide = document.createElement('div')
        slide.style.height = '100%'
        slide.style.position = 'absolute'
        slide.style.top = '0'
        slide.style.left = '0'
        slide.style.display = 'flex'
        return slide
    }
    function bindImgs (imgs, slide, width) {
        const newImgs = [...imgs, imgs[0]]
        newImgs.forEach (url => {
            const img = document.createElement('img')
            img.src = url
            img.style.width = width + 'px'
            slide.appendChild(img)
        })
    }
    return function(dom, imgs) {
        dom.style.position = 'relative'
        dom.style.overflow = 'hidden'
        const slide = creatSlide()
        dom.appendChild(slide)
        bindImgs(imgs, slide, dom.offsetWidth)

        this.length = imgs.length
        this.index = 0
        this.width = dom.offsetWidth
    }
}()

Banner.prototype.next = function() {
    const initial = this.slide.offsetLeft
    if(this.index == this.length) {
        this.index = 0
        this.slide.style.left = 0 + 'px'
    }
    this.index++
    let left = 0
    
    const timer = setInterval(()=> {
        left += 10
        if(left >= this.width) {
            clearInterval(timer)
            this.slide.style.left = (initial - this.width) + 'px'
        } else {
            this.slide.style.left = (initiial - left) + 'px'
        }
    }, 1)
}

Banner.prototype.play = function () {
    if(this.timer) {
        clearInterval(this.timer)
    }
    setInterval(()=> {
        this.next()
    }, 1500)
}