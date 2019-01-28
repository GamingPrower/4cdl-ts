# 4cdl - 4chan Downloader Typescript Rewrite
Command line interface to download images from a thread on 4chan.
REWRITTEN - Using Typescript and the 4chan API the speed is much faster and errors out MUCH less.

```npm i 4cdl-ts -g```

Install the program using the -g global flag so that it can be run from any directory

* mkdir img
* cd img

Create a new directory to store the images if needed.

```4cdl https://boards.4channel.org/c/thread/1234567```

In the command line you can input the direct link to the 4chan thread to download.

```4cdl 1234567 c```

You can use the ID instead of the full URL, but make sure you provide the board letter(e.g. c) when doing so.
