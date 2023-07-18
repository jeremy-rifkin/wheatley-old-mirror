# Getting Started with VS Code for C/C++

## :warning: Disclaimer for Beginners
Do not use VS Code.
It's better to use an IDE that works out of the box:
- [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/) on Windows (free)
- [CLion](https://www.jetbrains.com/clion/) on any platform (free for students)
- [XCode](https://developer.apple.com/xcode/) on macOS (free)
- [repl.it](https://replit.com/site/ide) online IDE (free for public projects)

## :one: Install a Compiler (possibly GCC through MinGW, or GCC through WSL)
Regardless of which editor you use, you need a compiler, which turns your code
into an executable.
Consider using
[Windows Subsystem for Linux](https://code.visualstudio.com/docs/cpp/config-wsl)
instead of
[MinGW](https://code.visualstudio.com/docs/languages/cpp#_example-install-mingwx64),
since Linux makes development much easier.

## :two: Install the C/C++ Extension by Microsoft
Install [the extension](https://code.visualstudio.com/docs/languages/cpp) and
follow the tutorial.
Do not use *Code Runner*, it does not work well for C/C++.

## :three: Install and Set Up CMake for VSCode
VSCode lets you configure your project through `build.json` and `launch.json`
config files.
However, it's *much easier* and *more portable* if you use
[CMake Tools](https://code.visualstudio.com/docs/cpp/CMake-linux) to generate
those.
On Windows, get the [CMake Windows x64 Installer](https://cmake.org/download/).

## :four: Set Up Debugging
It's *extremely* important that you learn how to debug your code.
[Follow this tutorial](https://code.visualstudio.com/docs/cpp/cpp-debug).
