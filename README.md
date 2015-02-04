# TCSS-491-Game

This is the master branch for our TCSS 491 Project.

--INSERT GAME DESC HERE--

### Installation for Playing
To install and run on your computer you can download this repo as a zip file and extract it into a directory of your choosing. Then, double click the mongoose.exe application to begin the server.

### Installation for Development
#### Game
Follow the instructions below to set-up development for the game:
* First create a new directory folder in any location.
* Next, download git and git bash here http://git-scm.com/downloads
* * For the installation of git bash make sure to select everything like linux/unix commands
* Now open git bash and cd into your directory
```sh
cd mydir
```
* Type in the following to clone the master branch into a new folder named master and cd into it
```sh
git clone https://github.com/names144/TCSS-491-Game.git master
cd master
```
* You are now ready to pull the master branch
```sh
git fetch origin master
git pull origin master
```
* You will be prompted for a username and password after you do the pull.
* Now you should have the game files in the master directory.

Demo

* The demo is the same as the master for the most part but with a few added things.
* First clone the repo into a folder called demo like we did previously for master.
```sh
git clone https://github.com/names144/TCSS-491-Game.git demo
cd demo
```
* Now we have to tell git that we want to track the demo branch in this folder.
```sh
git checkout demo
git fetch origin demo
git pull origin demo
```
* What we just did was tell git that we want to check out the branch demo and copy it into our demo folder locally.
Remember to always put origin <branch> whenever fetching, pulling or pushing to make sure git does the correct thing.
