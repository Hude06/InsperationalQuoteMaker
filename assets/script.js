// Function to check if the stored quote is from the current day
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function forceDownloadBlob(title,blob) {
    console.log("forcing download of", title)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
	a.download = title
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
function canvas_to_blob(canvas) {
    return new Promise((res,rej)=>{
        canvas.toBlob(blob => {
            res(blob)
        })
    })
}
function isQuoteFromToday(storedDate) {
	const today = new Date().toISOString().split('T')[0];
	return storedDate === today;
  }
  const storedQuote = localStorage.getItem('quote');
  const storedDate = localStorage.getItem('date');
  if (storedQuote && isQuoteFromToday(storedDate)) {
	document.getElementById("quote").textContent = '"' + storedQuote + '"';
	ctx.font = "48px serif";
	let dpi = window.devicePixelRatio*35
  	const WIDTH = storedQuote.length *5
	console.log("WORKING")
  	const HEIGHT = 300
  	canvas.width = WIDTH*dpi
  	canvas.height = HEIGHT*dpi
  	canvas.style.width = `${WIDTH}px`
  	canvas.style.width = `${HEIGHT}px`
	ctx.save()
  	ctx.scale(dpi,dpi)
	ctx.fillStyle = "white"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black"
	ctx.fillText('"'+storedQuote+'"', 10, 50);
  	ctx.restore()
	console.log(storedQuote.length)
  } else {
	fetch('https://type.fit/api/quotes')
	  .then(response => response.json())
	  .then(data => {
		const randomIndex = Math.floor(Math.random() * data.length);
		const quote = data[randomIndex].text;
		const author = data[randomIndex].author;
		const today = new Date().toISOString().split('T')[0];
		
		localStorage.setItem('quote', quote);
		localStorage.setItem('date', today);
		
		console.log('Quote of the day:', quote);
		console.log('Author:', author);
	  })
	  .catch(error => {
		console.error('Error fetching quote:', error);
	  });
}
async function download() {
	forceDownloadBlob("Quote Of the Day",await canvas_to_blob(canvas))
}
let button = document.getElementById("Download")
button.addEventListener("click", download);