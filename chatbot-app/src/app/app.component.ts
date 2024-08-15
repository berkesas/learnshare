import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatboxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chatbot-app';
}
