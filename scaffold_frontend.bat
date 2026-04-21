@echo off
echo Scaffolding Vite...
call npm create vite@latest frontend -- --template react --yes
echo Installing dependencies...
cd frontend
call npm install
call npm install react-router-dom lucide-react
echo Done.
