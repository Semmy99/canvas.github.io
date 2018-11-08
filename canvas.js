const canvas = document.getElementById('canvas');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const arrWrap = [canvas, canvas1, canvas2];


let test = null;

let quantityPoint = 65;
let args = [];




for (let i = 0; i < arrWrap.length; i++) {
	const circleArray = [];
	const canvas = arrWrap[i];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let ctx = canvas.getContext('2d');
	if (window.innerWidth > 800) quantityPoint = quantityPoint - 10

	calculatePoint(circleArray, ctx, quantityPoint);

	args.push({ circleArray: circleArray, ctx: ctx })
}

animate(args)()

function Circle(x, y, dx, dy, radius, xS, yS, circleArray, distance, ctx) {
	// контекст
	this.ctx = ctx;
	// координаты точки
	this.x = x;
	this.y = y;
	// скорость перемещения
	this.dx = dx;
	this.dy = dy;
	// радиус
	this.radius = radius;
	// радиус движения точек
	this.xS = xS;
	this.yS = yS;
	// массив конструкторов
	this.circleArray = circleArray;
	// максимальное расстояние соединения точек
	this.distance = distance;


	this.draw = function () {
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = "#5e5d8f";
		this.ctx.fill()
		this.ctx.stroke();

		for (let i = 0; i < circleArray.length; i += 1) {
			const pointLength = Math.sqrt((this.circleArray[i].x - this.x) * (this.circleArray[i].x - this.x) + (this.circleArray[i].y - this.y) * (this.circleArray[i].y - this.y));
			// расчет opacity
			let opacity;
			opacity = (pointLength > this.distance) ? opacity = 0 : 1 - pointLength * 1 / this.distance;

			if (pointLength < this.distance) {
				this.ctx.beginPath();
				this.ctx.moveTo(this.x, this.y)
				this.ctx.lineTo(this.circleArray[i].x, this.circleArray[i].y)
				this.ctx.strokeStyle = `rgba(94, 93, 143, ${opacity})`
				this.ctx.stroke();
			}
		}
	}

	this.update = function () {
		// условия для расчёта движения точки в диапозоне xS и yS
		if (this.x + this.radius > x + this.xS || this.x - this.radius < x - this.xS || this.x - this.radius < 0 || this.x + this.radius > innerWidth) this.dx = -this.dx;
		if (this.y + this.radius > y + this.yS || this.y - this.radius < y - this.yS || this.y - this.radius < 0 || this.y + this.radius > innerHeight) this.dy = -this.dy;

		this.x = this.x + this.dx
		this.y = this.y + this.dy

		this.draw()
	}

}

function calculatePoint(arr, ctx, quantityPoint) {
	for (let i = 0; i < quantityPoint; i++) {
		let radius = 4;
		let x = Math.random() * (innerWidth - radius * 2);
		let y = Math.random() * (innerHeight + radius * 2);

		let dx = (Math.random() - 0.5) * 0.5;
		let dy = (Math.random() - 0.5) * 0.5;
		const xS = 50;
		const yS = 50;
		const dist = 120;

		if (window.innerWidth < 800) quantityPoint = 35;
		console.log('quantityPoint', quantityPoint)

		arr.push(new Circle(x, y, dx, dy, radius, xS, yS, arr, dist, ctx));
	}
}


function animate(args) {

	return function () {
		test = requestAnimationFrame(animate(args));


		args.forEach(arg => {
			arg.ctx.clearRect(0, 0, innerWidth, innerHeight);
			for (let i = 0; i < arg.circleArray.length; i++) {
				arg.circleArray[i].update();
			}
		});
	}
}

console.log('test', test)
window.addEventListener('resize', function () {
	if (window.innerWidth < 800) quantityPoint = 35
	cancelAnimationFrame(test)
	args.forEach(arg => {
		arg.ctx.clearRect(0, 0, 521, 521);
	});
	requestAnimationFrame(animate(args))
})