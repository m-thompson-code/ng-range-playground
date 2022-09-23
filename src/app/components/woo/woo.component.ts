import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { ColorsService } from 'src/app/services/colors.service';

export interface RenderColor {
    color: string;
    timestamp: number;
    xStartPercent: number;
    xEndPercent: number;
    yMaxPercent: number;
    x: number;
    y: number;
    velocity: number;
    startVelocity: number;
    gravity: number;
    estEndTicks: number;
    ticks: number;
    scale: number;
    width: number;
}

const UPDATE_RATE = 1000/60;

@Component({
    selector: 'app-woo',
    templateUrl: './woo.component.html',
    styleUrls: ['./woo.component.scss']
})
export class WooComponent implements AfterViewInit {
    @ViewChild('canvas', {static: false}) private canvas!: ElementRef<HTMLCanvasElement>;
    @Input() divContainer!: HTMLDivElement;

    private _colors: RenderColor[] = [];

    private _drawInterval?: number;

    private readonly colorsService = inject(ColorsService);

    private clearTimeout?: number;

    woo(): void {
        this.pushColors();
        
        clearTimeout(this.clearTimeout);

        this.clearTimeout = window.setTimeout(() => {
            this._colors = [];
        }, 10_000);
    }

    ngAfterViewInit(): void {
        this.draw();

        this._drawInterval = window.setInterval(() => {
            this.animate();
        }, UPDATE_RATE);
    }

    pushColors(): void {
        for (let i = 0; i < 400; i++) {
            setTimeout(() => {
                this.pushColor();
            }, i * 2 + i * i / 400);
        }
    }

    pushColor(): void {
        const height = this.divContainer.offsetHeight;

        const g = .3 + Math.random() / 2;

        const yMaxPercent = Math.random() / 2 + .5;

        const initalV = Math.sqrt(2 * g * (height + 50) * yMaxPercent);

        const estEndTicks = initalV * 2 / g;

        const xStartPercent = Math.random() * .15 + .45;
        const xEndPercent = Math.random();

        let color = Math.random() < .6 ? '#71c4c8' : '#c9997f';

        const scale = .5 + Math.random() * 1.25;

        color = this.colorsService.getRandomColor();

        const width = 2 + Math.random() * 6;

        this._colors.push({
            color: color,
            timestamp: Date.now(),
            xStartPercent: xStartPercent,
            xEndPercent: xEndPercent,
            yMaxPercent: yMaxPercent,
            x: 0,
            y: -50,
            velocity: initalV,
            startVelocity: initalV,
            estEndTicks: estEndTicks,
            gravity: g,
            ticks: 0,
            width: width,
            scale: scale,
        });
    }

    animate(): void {
        const height = this.divContainer.offsetHeight;
        const width = this.divContainer.offsetWidth;

        const now = Date.now();

        const newColors = [];

        for (const color of this._colors) {
            color.velocity -= color.gravity;

            color.y += color.velocity;

            // Delete partical if below screen
            if (color.y < -50) {
                continue;
            }

            color.ticks += 1;

            color.x = color.xStartPercent * width + (color.xEndPercent - color.xStartPercent) * width * color.ticks / color.estEndTicks;

            newColors.push(color);
        }

        this._colors = newColors;
    }

    draw(): void {
        const _drawLoop = () => {
            const height = this.divContainer.offsetHeight;
            const width = this.divContainer.offsetWidth;

            const _c = this.canvas.nativeElement;

            const ctx = _c.getContext('2d');

            if (!ctx) {
                debugger;
                return;
            }

            _c.height = height;
            _c.width = width;

            ctx.clearRect(0, 0, width, height);// clear canvas


            for (const color of this._colors) {
                const lineWidth = color.width * color.scale;
                ctx.lineWidth = 3 * color.scale;

                if (color.y < -lineWidth) {
                    continue;
                }

                const _rh = Math.floor(Math.random() * lineWidth * 2) - lineWidth;
                const _rw = Math.floor(Math.random() * lineWidth * 2) - lineWidth;

                ctx.strokeStyle = color.color;
                ctx.beginPath();
                ctx.moveTo(color.x - _rh, height - (color.y - _rw));
                ctx.lineTo(color.x, height - color.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(color.x, height - color.y);
                ctx.lineTo(color.x + _rh, height - (color.y + _rw));
                ctx.stroke();
            }

            window.requestAnimationFrame(_drawLoop);
        }

        window.requestAnimationFrame(_drawLoop);
    }

    ngOnDestroy(): void {
        clearInterval(this._drawInterval);
    }
}