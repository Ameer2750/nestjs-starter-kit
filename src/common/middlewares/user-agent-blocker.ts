import { Request, Response, NextFunction } from 'express';

export function UserAgentBlocker(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  
  const banned = [
    'sqlmap',
    'curl',
    'wget',
    'python',
    'requests',
    'aiohttp',
    'java',
    'libwww-perl',
    'go-http-client',
    'httpclient',
    'masscan',
    'nmap',
    'nikto',
    'gobuster',
    'ffuf',
    'dirbuster',
    'crawler',
    'bot',
    'spider'
  ];


  if (banned.some((b) => ua.includes(b))) {
    return res.status(403).json({
      message: 'Forbidden user agent',
      reason: 'Blocked by WAF',
    });
  }

  next();
}
