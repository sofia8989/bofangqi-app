import html2canvas from "html2canvas";


export const htmlTocanvas =(html,bgColor ='#282828',name="fx")=>{
    html2canvas(html, {
		backgroundColor: bgColor,//海报的背景颜色
		useCORS: true, // 允许跨域
	}).then(canvas => {
		let baseImg = canvas.toDataURL("image/png");
		let save = document.createElement('a');
		save.href = baseImg;
		save.download = name
		save.click()
		save.remove()
	})
} 