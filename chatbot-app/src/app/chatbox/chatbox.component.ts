import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Pipe, PipeTransform } from '@angular/core';
import { ChatBotService } from '../chat-bot.service';
import { ChatBotMessage } from '../chat-bot-message';
import { LoadingDots } from '../loading-dots/loading-dots.component';
import { TypewriterComponent } from '../typewriter/typewriter.component';

@Pipe({
  name: 'shortenDate',
  standalone: true,
})

export class ShortenDatePipe implements PipeTransform {
  transform(dateString: string, args?: any): any {
    const convertedDate = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(convertedDate);
  }
}

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, ShortenDatePipe, LoadingDots, TypewriterComponent],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '500px',
          // width: '300px',
          opacity: 1,
        }),
      ),
      state(
        'closed',
        style({
          height: '500px',
          // width: '0px',
          opacity: 0,
        }),
      ),
      transition('open => closed', [animate('0.3s ease-out')]),
      transition('closed => open', [animate('0.3s ease-out')]),
    ]),
  ],
})
export class ChatboxComponent {
  chatWindowVisible = false;
  conversationHistory: ChatBotMessage[] = [];
  loading = false;
  typing!: boolean[];
  lastReply = {} as ChatBotMessage;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('chatMessage') private chatMessage!: ElementRef;
  emptySubmissionCount = 0;
  readonly emptySubmissionLimit = 2;
  questionCount = 0;
  readonly questionLimit = 50;

  constructor(private chatBotService: ChatBotService) {
    this.conversationHistory = [];
    this.typing = [];
  }

  toggleChat() {
    this.chatWindowVisible = !this.chatWindowVisible;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  ngAfterViewInit() {
    const message = `Hello! My name is VirtuBot. I am a virtual assistant representing [Your name]. You can ask me questions as if I am [Your name].`;
    const sampleQuestion = `Tell me about yourself?`;
    this.addServerMessage(message, [sampleQuestion]);
  }

  sendMessage(): void {
    const message = this.chatMessage.nativeElement.value;
    if (message) {
      this.chatSubmit(this.chatMessage.nativeElement.value);
      this.chatMessage.nativeElement.value = '';
      this.emptySubmissionCount = 0;
    } else {
      if (this.emptySubmissionCount < this.emptySubmissionLimit) {
        this.addServerMessage("Please try to write a question and then send it", []);
        this.emptySubmissionCount++;
      }
    }
  }

  private chatSubmit(message: string) {
    if (this.questionCount < this.questionLimit) {
      const newMessage: ChatBotMessage = {
        source: 'client',
        text: message,
        created: (new Date()).toISOString(),
        additionalQuestions: []
      }
      this.typing.push(false);
      this.conversationHistory.push(newMessage);
      this.getResponse(newMessage);
      this.questionCount++;
    } else {
      this.addServerMessage("You have reached the question limit. Please try again later.", []);
    }
  }

  private getResponse(message: ChatBotMessage): void {
    this.loading = true;
    this.chatBotService.getResponse(message.text)
      .subscribe(responseMessages => {
        this.loading = false;
        this.typing.push(true);
        responseMessages[0].created = (new Date()).toISOString();
        this.conversationHistory.push(responseMessages[0]);
      })
  }

  private addServerMessage(message: string, additional: string[]): void {
    const newDate = new Date();
    const newMessage = {
      source: 'server',
      text: message,
      created: (new Date()).toISOString(),
      additionalQuestions: additional
    }
    this.typing.push(true);
    this.conversationHistory.push(newMessage);
  }

  receiveMessageFromChild($event: number) {
    this.typing[$event] = false;
  }

  proposedQuestion(message: string) {
    this.chatSubmit(message);
  }

}