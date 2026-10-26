<script lang="ts">
	import { ReducedMotion } from '#lib/hooks/reduced-motion.svelte.js';
	import { cn } from '#lib/utils.js';

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

	const reducedMotion = new ReducedMotion();

	// Singleton context untuk parse warna agar tidak membuat canvas baru di setiap render
	let sharedCtx: CanvasRenderingContext2D | null = null;
	const parseToRGBPrefix = (colorStr: string): string => {
		if (typeof window === 'undefined') return 'rgba(0, 0, 0, ';
		if (!sharedCtx) {
			const c = document.createElement('canvas');
			c.width = c.height = 1;
			sharedCtx = c.getContext('2d', { willReadFrequently: true });
		}
		if (!sharedCtx) return 'rgba(0, 0, 0, ';

		sharedCtx.fillStyle = colorStr;
		sharedCtx.fillRect(0, 0, 1, 1);
		const [r, g, b] = sharedCtx.getImageData(0, 0, 1, 1).data;
		return `rgba(${r}, ${g}, ${b}, `;
	};

	interface GridState {
		cols: number;
		rows: number;
		squares: Float32Array;
		dpr: number;
	}

	const setupGrid = (
		w: number,
		h: number,
		sqSize: number,
		gap: number,
		opacityLimit: number
	): GridState => {
		const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
		const step = sqSize + gap;
		const cols = Math.floor(w / step);
		const rows = Math.floor(h / step);
		const squares = new Float32Array(cols * rows);

		for (let i = 0; i < squares.length; i++) {
			squares[i] = Math.random() * opacityLimit;
		}

		return { cols, rows, squares, dpr };
	};

	const updateGridSquares = (
		squares: Float32Array,
		deltaTime: number,
		chance: number,
		opacityLimit: number
	) => {
		const threshold = chance * deltaTime;
		for (let i = 0; i < squares.length; i++) {
			if (Math.random() < threshold) {
				squares[i] = Math.random() * opacityLimit;
			}
		}
	};

	const renderGrid = (
		ctx: CanvasRenderingContext2D,
		grid: GridState,
		sqSize: number,
		gap: number,
		rgbPrefix: string
	) => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		const step = (sqSize + gap) * grid.dpr;
		const size = sqSize * grid.dpr;

		for (let i = 0; i < grid.cols; i++) {
			const x = i * step;
			for (let j = 0; j < grid.rows; j++) {
				const opacity = grid.squares[i * grid.rows + j];
				// Optimasi: skip square transparan agar menghemat draw call
				if (opacity < 0.01) continue;

				ctx.fillStyle = `${rgbPrefix}${opacity})`;
				ctx.fillRect(x, j * step, size, size);
			}
		}
	};

	$effect(() => {
		const canvas = canvasRef;
		const container = containerRef;
		if (!canvas || !container) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Snapshot props ke local dependencies (bersih dari warning ESLint & reaktif secara eksplisit)
		const currentSquareSize = squareSize;
		const currentGridGap = gridGap;
		const currentFlickerChance = flickerChance;
		const currentMaxOpacity = maxOpacity;
		const explicitWidth = width;
		const explicitHeight = height;
		const rgbPrefix = parseToRGBPrefix(color);

		// WCAG: preferensi reduced motion
		const prefersReducedMotion = reducedMotion.current;

		let animationFrameId = 0;
		let isVisible = true;
		let lastTime = 0;
		let grid: GridState | null = null;

		const draw = () => {
			if (!grid || grid.cols === 0 || grid.rows === 0) return;
			renderGrid(ctx, grid, currentSquareSize, currentGridGap, rgbPrefix);
		};

		const resize = () => {
			const w = explicitWidth ?? container.clientWidth;
			const h = explicitHeight ?? container.clientHeight;
			if (w <= 0 || h <= 0) return;

			grid = setupGrid(w, h, currentSquareSize, currentGridGap, currentMaxOpacity);
			canvas.width = w * grid.dpr;
			canvas.height = h * grid.dpr;
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;

			draw();
		};

		const loop = (time: number) => {
			if (!isVisible || prefersReducedMotion) return;

			if (!lastTime) lastTime = time;
			const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
			lastTime = time;

			if (grid) {
				updateGridSquares(grid.squares, deltaTime, currentFlickerChance, currentMaxOpacity);
				draw();
			}

			animationFrameId = requestAnimationFrame(loop);
		};

		const start = () => {
			if (prefersReducedMotion) return;
			lastTime = 0;
			cancelAnimationFrame(animationFrameId);
			animationFrameId = requestAnimationFrame(loop);
		};

		const stop = () => {
			cancelAnimationFrame(animationFrameId);
		};

		// Sinkron render pertama
		resize();
		start();

		const resizeObserver = new ResizeObserver(() => {
			resize();
		});
		resizeObserver.observe(container);

		const intersectionObserver = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting;
				if (isVisible) {
					start();
				} else {
					stop();
				}
			},
			{ threshold: 0 }
		);
		intersectionObserver.observe(canvas);

		return () => {
			stop();
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
		};
	});
</script>

<div
	bind:this={containerRef}
	class={cn('relative h-full w-full overflow-hidden', className)}
	{...restProps}
>
	<canvas
		bind:this={canvasRef}
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 block h-full w-full"
	></canvas>
</div>
