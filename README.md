# ox_lib

A FiveM library and resource implementing reusable modules, methods, and UI elements.

![](https://img.shields.io/github/downloads/communityox/ox_lib/total?logo=github)
![](https://img.shields.io/github/downloads/communityox/ox_lib/latest/total?logo=github)
![](https://img.shields.io/github/contributors/communityox/ox_lib?logo=github)
![](https://img.shields.io/github/v/release/communityox/ox_lib?logo=github)

For guidelines to contributing to the project, and to see our Contributor License Agreement, see [CONTRIBUTING.md](./CONTRIBUTING.md)

For additional legal notices, refer to [NOTICE.md](./NOTICE.md).


## 📚 Documentation

https://coxdocs.dev/ox_lib

## 💾 Download

https://github.com/communityox/ox_lib/releases/latest/download/ox_lib.zip

## 📦 npm package

https://www.npmjs.com/package/@communityox/ox_lib

## 🖥️ Lua Language Server

- Install [Lua Language Server](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) to ease development with annotations, type checking, diagnostics, and more.
- Install [CfxLua IntelliSense](https://marketplace.visualstudio.com/items?itemName=communityox.cfxlua-vscode-cox) to add natives and cfxlua runtime declarations to LLS.
  - You can load ox_lib into your global development environment by modifying workspace/user settings "Lua.workspace.library" with the resource path.
    - e.g. "c:/fxserver/resources/ox_lib"

## Custom Options
- Use the ```setr ox:darkMode``` convar to enable/disable dark mode by default (1 for dark mode, 0 for light)
- Change the default progress bar icon(clock by default) by setting ```icon = 'icon'``` when you define your progres bars.
- Switch between dark/light mode in-game via the ```/ox_lib``` command.
- Enable/disable opening/closing animations via the ```/ox_lib``` command as well.
