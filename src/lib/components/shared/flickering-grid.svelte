<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		squareSize = 4,
		gridGap = 6,
		flickerChance = 0.3,
		color = 'rgb(0, 0, 0)',
		width,
		height,
		maxOpacity = 0.3,
		class: className,
		...restProps
	}: {
		squareSize?: number;
		gridGap?: number;
		flickerChance?: number;
		color?: string;
		width?: number;
		height?: number;
		maxOpacity?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let canvasRef: HTMLCanvasElement | undefined = $state(undefined);
	let containerRef: HTMLDivElement | undefined = $state(undefined);
	let isInView = $state(false);
	let canvasSize = $state({ width: 0, height: 0 });

	function toRGBA(colorStr: string): string {
		if (typeof window === 'undefined') return 'rgba(0, 0, 0,';
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		const ctx = canvas.getContext('2d');
		if (!ctx) return 'rgba(0, 0, 0,';
		ctx.fillStyle = colorStr;
		ctx.fillRect(0, 0, 1, 1);
		const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
		return `rgba(${r}, ${g}, ${b},`;
	}

	const memoizedColor = $derived(toRGBA(color));

	function setupCanvas(canvas: HTMLCanvasElement, w: number, h: number) {
		const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		const cols = Math.floor(w / (squareSize + gridGap));
		const rows = Math.floor(h / (squareSize + gridGap));
		const squares = new Float32Array(cols * rows);
		for (let i = 0; i < squares.length; i++) {
			squares[i] = Math.random() * maxOpacity;
		}
		return { cols, rows, squares, dpr };
	}

	function updateSquares(squares: Float32Array, deltaTime: number) {
		for (let i = 0; i < squares.length; i++) {
			if (Math.random() < flickerChance * deltaTime) {
				squares[i] = Math.random() * maxOpacity;
			}
		}
	}

	function drawGrid(
		ctx: CanvasRenderingContext2D,
		w: number,
		h: number,
		cols: number,
		rows: number,
		squares: Float32Array,
		dpr: number
	) {
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = 'transparent';
		ctx.fillRect(0, 0, w, h);
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const opacity = squares[i * rows + j];
				ctx.fillStyle = `${memoizedColor}${opacity})`;
				ctx.fillRect(
					i * (squareSize + gridGap) * dpr,
					j * (squareSize + gridGap) * dpr,
					squareSize * dpr,
					squareSize * dpr
				);
			}
		}
	}

	$effect(() => {
		const canvas = canvasRef;
		const container = containerRef;
		if (!canvas || !container) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationFrameId = 0;
		let gridParams: ReturnType<typeof setupCanvas> | undefined;

		const updateCanvasSize = () => {
			const newWidth = width ?? container.clientWidth;
			const newHeight = height ?? container.clientHeight;
			canvasSize = { width: newWidth, height: newHeight };
			gridParams = setupCanvas(canvas, newWidth, newHeight);
			// initial draw
			if (gridParams) {
				drawGrid(
					ctx,
					canvas.width,
					canvas.height,
					gridParams.cols,
					gridParams.rows,
					gridParams.squares,
					gridParams.dpr
				);
			}
		};

		updateCanvasSize();

		let lastTime = 0;
		const animate = (time: number) => {
			if (!isInView) {
				animationFrameId = requestAnimationFrame(animate);
				return;
			}
			const deltaTime = (time - lastTime) / 1000;
			lastTime = time;
			if (gridParams) {
				updateSquares(gridParams.squares, deltaTime);
				drawGrid(
					ctx,
					canvas.width,
					canvas.height,
					gridParams.cols,
					gridParams.rows,
					gridParams.squares,
					gridParams.dpr
				);
			}
			animationFrameId = requestAnimationFrame(animate);
		};

		const resizeObserver = new ResizeObserver(() => {
			updateCanvasSize();
		});
		resizeObserver.observe(container);

		const intersectionObserver = new IntersectionObserver(
			([entry]) => {
				isInView = entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		intersectionObserver.observe(canvas);

		// start loop
		animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
		};
	});
</script>

<div bind:this={containerRef} class={cn('h-full w-full', className)} {...restProps}>
	<canvas
		bind:this={canvasRef}
		class="pointer-events-none"
		style:width={`${canvasSize.width}px`}
		style:height={`${canvasSize.height}px`}
	></canvas>
</div>
