import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    standalone: true,
    selector: 'app-typewriter',
    template: `<div [innerHTML]="displayedText"></div>`
})

export class TypewriterComponent implements OnInit {
    @Input() content!: string; // Takes input "content" as string
    @Input() id!: number; // Takes message "id" as input 
    @Output() messageEvent = new EventEmitter<number>(); // Issues an event when typing is over
    readonly speedFactor = 6000; //A subjective constant to adjust speed initially. It is number of milliseconds
    safeContent!: SafeHtml;
    displayedText: string = ''; // This is the text displayed in the component
    currentIndex: number = 0; // This variable tracks the character that's being typed at the moment
    interval!: number; // This is the interval at which the next character of the input string is printed.

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.interval = Math.ceil(this.speedFactor / (this.content.length + 1)); // One is a subjective choice to prevent division by 0.
        if(this.interval>50) this.interval = 50;
        this.typeWriter();
    }

    typeWriter(): void {
        if (this.currentIndex < this.content.length) {
            this.displayedText += this.content.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.typeWriter(), this.interval); // Adjust the delay as needed
        } else {
            this.messageEvent.emit(this.id);
        }
    }
}