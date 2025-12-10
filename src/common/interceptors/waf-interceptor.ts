import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WafInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const body = JSON.stringify(request.body || {});
    const query = JSON.stringify(request.query || {});
    const params = JSON.stringify(request.params || {});

    const payload = body + query + params;

    // SQL Injection signatures
    const sqliPatterns = /(union|select|insert|drop|sleep|benchmark|--|;|')/i;

    // XSS signatures
    const xssPatterns = /(<script|onerror|onload|javascript:|alert\()/i;

    if (sqliPatterns.test(payload) || xssPatterns.test(payload)) {
      throw new BadRequestException('Malicious payload blocked by WAF');
    }

    return next.handle();
  }
}
