# bga-dojoless
Bga project template with as little dojo as possible.
Only usable when you develop games for https://boardgamearena.com

It uses typescript and possible to use scss

To use you need tsc (typescript), which will be installed by npm, which is part of nodejs
* Install nodejs (search web on how to install for your platform), i.e. sudo apt-get install nodejs
* Type "npm i" in the project directory - it will install tsc and scss compilers
To use in vscode:
* Install SFTP and configure, see https://en.doc.boardgamearena.com/Setting_up_BGA_Development_environment_using_VSCode

Run the following command to auto-compile typescript (auto-upload will be enabled if you configure SFTP extension)
* npm run watch:ts
If you want both typescript and scc type
* npm run watch:ts

