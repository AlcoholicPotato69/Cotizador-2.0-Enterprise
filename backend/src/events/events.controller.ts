import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('events')
export class EventsController {
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(30000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
