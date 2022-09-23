import { Component, Input } from '@angular/core';
import { ColorsService } from 'src/app/services/colors.service';

@Component({
  selector: 'anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss']
})
export class AnimeComponent {
  @Input() background = this.colorService.getRandomColor();

  constructor(private readonly colorService: ColorsService) {}
}
