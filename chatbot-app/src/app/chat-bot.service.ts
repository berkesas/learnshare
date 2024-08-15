import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ChatBotMessage } from './chat-bot-message';

@Injectable({ providedIn: 'root' })
export class ChatBotService {
  readonly chatbotAPI = "chatbot.json"; //normally it should look like http://yoursite.com/api/chatbot


  constructor(private http: HttpClient) { }

  getResponse(question: string): Observable<ChatBotMessage[]> {
    const errorMessage: ChatBotMessage = {
      source: 'server',
      text: 'I apologize for the inconvenience but I cannot access the server at the moment. You can contact me at myemail@domain.com if you have any questions.',
      created: (new Date()).toISOString(),
      additionalQuestions: []
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const questionMessage = { text: question };
    return this.http.post<ChatBotMessage[]>(this.chatbotAPI, questionMessage, { headers })
      .pipe(
        catchError(error => {
          console.error('Error occurred:', error);
          return of([errorMessage]);
        }));
  }
}