import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
})
export class VideoModalComponent {
  @Input() videoId: string = '';

  constructor(public sanitizer: DomSanitizer) {}
}
