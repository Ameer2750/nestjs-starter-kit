import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, BadRequestException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CustomResponseObjectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => {
        return {
          statusCode,
          message: statusCode >= 400 ? 'Error' : 'Success',
          error: statusCode >= 400 ? response.message : null,
          timestamp: Date.now(),
          version: 'v1',
          path: request.url,
          data: data,
        };
      }),
      catchError(err => {
        console.log('err: ', err instanceof BadRequestException);
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;

        // Create a detailed error response
        let errorResponse = {
          statusCode,
          message: 'Internal server error',
          error: 'Error',
          timestamp: Date.now(),
          version: 'v2',
          path: request.url,
          data: {}, // This will be populated for validation errors
        };

        if (err instanceof BadRequestException) {
          // Assign the validation errors directly
          errorResponse.message = 'Validation Error';
          errorResponse.data = err.getResponse(); // Include the validation errors as they are
        } else {
          errorResponse.message = err.message || 'Internal server error';
          errorResponse.error = err.name || 'Error';
        }

        return throwError(() => new HttpException(errorResponse, statusCode));
      })
    );
  }
}
