@echo off
REM Install dependencies
cd "%~dp0..\pos-desk"
npm install

REM Start development server
npm run dev