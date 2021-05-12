let customName = document.getElementById('name')
let button = document.querySelector('button')
let story = document.querySelector('.story')

let storyText = '今天气温 35 摄氏度,:insertx:出门散步。当走到:inserty:门前时，突然就:insertz:。人们都惊呆了,Danan全程目睹但并没有慌，因为:insertx:是一个 140 公斤的胖子，天气又辣么热。'

let insertX = ['怪兽威利', '大老爹', '圣诞老人']
let insertY = ['肯德基', '迪士尼乐园', '白宫']
let insertZ = ['自燃了', '在人行道化成了一坨泥', '变成一只鼻涕虫爬走了']

function FindRandomValue (array) {
	let random_num = Math.floor(Math.random() * array.length)
	return array[random_num]
}

button.addEventListener('click', result) 

function result () {
	let newStory = storyText
	let xItem = FindRandomValue(insertX)
	let yItem = FindRandomValue(insertY)
	let zItem = FindRandomValue(insertZ)

	if(customName.value !== '') {
		console.log("小样不听话？")
		const name = customName.value;
    	newStory = newStory.replace('Danan', name);
	}

	newStory = newStory.replace (':insertx:', xItem)
	newStory = newStory.replace (':inserty:', yItem)
	newStory = newStory.replace (':insertz:', zItem)
	newStory = newStory.replace(':insertx:', xItem);
	
	console.log(newStory)
  	if(document.getElementById("American").checked) {
		const weight = Math.round(140 * 2.20462) + ' 磅';
		const temperature =  Math.round(35 * 9 / 5 + 32) + ' 华氏';
		newStory = newStory.replace('35 摄氏度', temperature);
		newStory = newStory.replace('140 公斤', weight);
  	}
	story.textContent = newStory
	story.style.visibility = 'visible'
}