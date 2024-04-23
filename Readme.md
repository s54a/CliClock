<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [@s54a/CLI Clock || CLI Clock && Timer && Stopwatch](#s54acli-clock--cli-clock--timer--stopwatch)
  - [Installation](#installation)
  - [Features](#features)
  - [Usage](#usage)
  - [Folder Structure](#folder-structure)
  - [Github](#github)
  - [NPM](#npm)
  - [License](#license)
  - [Why I Made this:](#why-i-made-this)
  - [How it works (A bit of Code Explanation)](#how-it-works-a-bit-of-code-explanation)
  - [A few question you might ask](#a-few-question-you-might-ask)
  - [What I have learned after making a few NPM Packages](#what-i-have-learned-after-making-a-few-npm-packages)
  - [Credit For Timer Ending Sound](#credit-for-timer-ending-sound)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# @s54a/CLI Clock || CLI Clock && Timer && Stopwatch

CliClock is a command-line tool that allows users to perform various time-related functions such as displaying the current time, starting a stopwatch, setting a timer, and more, all from the comfort of their terminal.

## Installation

This package provides an Executable Command

So You will have to install this package globally to be able to use the `init` command.

```bash
npm install -g @s54a/cliclock
```

**OR**

```bash
npx @s54a/cliclock
```

## Features

- **Display Current Time**: Simply type `t` to display the current time.
- **Stopwatch Functionality**: Start a stopwatch by typing `t -s`.
- **Set a Timer**: Set a timer by typing `t [time]`. Supported time units include hours (`h`), minutes (`m`), and seconds (`s`).
- **Funny Sound Option**: Add a fun element to your timer with the `-f` flag, e.g., `t 10m -f`.
- **Customize VLC Path**: Set the path to the VLC executable for audio playback.
- **Customize Audio Path**: Set the path to the audio file for the alarm, including the option to use the default audio file.

## Usage

- To display the current time:

  ```bash
  t
  ```

- To start a stopwatch:

  ```bash
  t -s
  ```

- To set a timer:

  ```bash
  t [time]
  ```

  Example: `t 10m` (for 10 minutes)

- To set a timer with a funny sound:

  ```bash
  t [time] -f
  ```

- To set the path to the VLC executable:

  ```bash
  t --vlc-path [path]
  ```

- If you don't have VLC installed or don't want to play sound when the timer ends you can just set VLC.exe Path as no

  ```bash
  t --vlc-path no
  ```

- To set new Audio for when the timer Ends:

  ```bash
  t --audio-path [path]
  ```

- To set back to default:

  ```bash
  t --audio-path "default-audio"
  ```

For a detailed help menu, type:

```bash
t -h
```

- To exit any time press **Esc**

## Folder Structure

    📁 cliClock
    ├── 📁 src
    │ ├── 📄 cliInterface.js
    │ ├── 📄 config.js
    │ ├── 📄 exitCliClock.js
    │ ├── 📄 fixWindowsPath.js
    │ ├── 📄 getVLCPath.js
    │ ├── 📄 handleSnoozeInput.js
    │ ├── 📄 index.js
    │ ├── 📄 notifyTimer.js
    │ ├── 📄 parseTimeInput.js
    │ ├── 📄 runCommand.js
    │ ├── 📄 saveConfig.js
    │ ├── 📄 setDefaultAudioPath.js
    │ └── 📄 soundFunctions.js
    ├── 📄 .gitignore
    ├── 🎵 audio.mp3
    ├── 🎵 sound.mp3
    ├── 📜 LICENSE
    ├── 📝 Readme.md
    ├── 📋 package.json
    ├── 📋 package-lock.json
    └── 🖼️ timer-svgrepo-com.png

## Github

https://github.com/s54a/s54a-cliclock

## NPM

https://www.npmjs.com/package/@s54a/cliclock

## License

This project is licensed under the MIT License

## Why I Made this:

It would an under statement to say that I have been a **Professional Times Waster**.

I way I figured out to Waste Less Time was setting timer then waste my time only till the timer ended.

But it was a hassle to set timers usi **GUI** so for a really long timer I wanted to build a CLI Timer.

So some time ago learned to make CLI Programs using Node JS. So I made this.

And I have spent a bit much to make it cross platform but I didn't had the resources to Test it so feel free to make any changes

## How it works (A bit of Code Explanation)

I will explain the Timer Part only rest is very simple

First it runs a function called getVLCPath. It guess a correct path for the VLC.exe but if it all possible guessed paths are wrong then it will prompt you to enter the VLC.exe path.

If you don't want to give the path for VLC.exe you can answer **no** and it will start the timer but won't play the audio file.

But you can change this behavior any time by using the `--vlc-path` flag and set path for VLC.exe and it will play the audio.

But I have set it so that it will play a beep sound or whatever your system has using the **Node-Notifier** when the timer ends.

Then it sets the path for sound.mp3 in config.js so that VLC can play the sound.

Then it passes the user input through parseInputTimer function which extracts the units for timer and starts a timer using Set Interval.

When the timer ends it uses node-notifier to send notifications.
And in the push notification there is an option to _Snooze Timer for 3 Minutes_ & Another Option to _End Timer_

While in terminal it prompts you to snooze timer which uses the **Readline** Module.
Input Time & Press Enter and it will restart Timer.

## A few question you might ask

Why there is a file called fixWindowsPath.js ?

Well File paths in windows use "\" which in JS is used as a Escape Character and then it creates issues.

## What I have learned after making a few NPM Packages

What you are trying to build will be build very easily but the validation, errors, more feature, things which you didn't planned for, and etc

e.g. When I started to build this package the Timer, StopWatch, Clock Functionality was done in about Two Hours but I wanted to send notification and play sound then I wanted the user to have the ability to enter timer in any format, then being able to change the audio it took more then 20 Days.

If you are a web developer you will think there must a native in node js to play sound and stop playing sound.

But there isn't.

So I think & according to this [StackOverFlow](https://stackoverflow.com/questions/12543237/play-audio-with-node-js) answer there are Four Packages

- Node Speaker (I cant figure this one)
- Audic (The Size Bloats to 180 MBs)
- SoundPlay (It can play sound but can't stop it)
  - I tried to change the source code and the functionality to stop the playing sound but it didn't happen.
  - So after banging my head on this issue for a few days Chat GPT gave me a solution to play sound using VLC Media Player and it was cross platform as well.
  - I will create this as a package and upload soon.
- PlaySound (Didn't work)

##### Credit For Timer Ending Sound

Sound Effect by <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=126505">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=126505">Pixabay</a>
