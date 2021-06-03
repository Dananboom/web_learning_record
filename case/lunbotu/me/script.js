const Bunner = function(){
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
    
    return function(dom, imgs){
        dom.style.position = 'relative'
        dom.style.overflow = 'hidden'
    
        this.slide = createSlide() 
        bindImages(slide, imgs, dom.offsetWidth)
        dom.appendChild(this.slide)
    
        this.index = 0
        this.length = imgs.length
        this.width = dom.offsetWidth
    }
}