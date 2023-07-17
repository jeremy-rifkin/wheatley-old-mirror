# Getting Started With VS Code for C/C++

## DISCLAIMER FOR BEGINNERS
Do not use VS Code.
It's better to use an IDE that works out of the box:
- [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/) for Windows (free)
- [CLion](https://www.jetbrains.com/clion/) on any platform (free for students)
- [XCode](https://developer.apple.com/xcode/) on macOS (free)
- [repl.it](https://replit.com/site/ide) online IDE (free for public projects)

## 1. Install The C/C++ Extension by Microsoft
Install [the extension](https://code.visualstudio.com/docs/languages/cpp) and
follow the tutorial.
Don't use third-party plugins like *Code Runner*, use the official stuff.

## 2. Install A Compiler (possibly GCC through MinGW, or GCC through WSL)
You still need to install a compiler, which is the thing that turns your code
into an executable, separately.
Consider using
[Windows Subsystem for Linux](https://code.visualstudio.com/docs/cpp/config-wsl)
instead of MinGW, since Linux makes development much easier.

## 3. Install and Set Up CMake for VSCode
VSCode lets you configure your project through `build.json` and `launch.json`
config files.
However, it's *much easier* and *more portable* if you use
[CMake Tools](https://code.visualstudio.com/docs/cpp/CMake-linux) to generate
those.
On Windows, get the [CMake Windows x64 Installer](https://cmake.org/download/).

## 4. Set Up Debugging
It's *extremely* important that you learn how to debug your code.
[Follow this tutorial](https://code.visualstudio.com/docs/cpp/cpp-debug).
