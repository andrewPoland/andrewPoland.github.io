---
hidden: true
---
#Stop doing manual shit

I do way too much manual work. I am guilty of right click publishing projects. I am guilty of manually running integration tests.

>The definition of insanity is doing the same thing over and over and expecting different results

I often feel like I'm crazy when I make a code change and I manually run a test with the same inputs, expecting the same outputs and getting the same results 90% of the time. So why waste my time when I can get a robot to do it for me?

A few weeks ago I watched a dev-ops video from Build and it got me genuinely excited. Azure offers what they call DevOps Projects. These projects attempt to automate the setup of everything you might need to make that initial leap into the world of automation. They're not perfect and it doesn't set everything up, but it points you in the right direction. This is extremely valuable if you've never set anything like this up before.

##so... what does it give you?

1.

##how I set it up?

This is one of the rare azure tools you actually want to setup from the portal, so from the portal if you search for DevOps it should show up like below.

Once you've clicked through to creating a DevOps Project it presents you with the following wizard. There are multiple streams you can take here, the wizard supports creating new projects, where you choose the language and azure resources that you want to create. In my case I'm using the azure function code I wrote about earlier so I went with the "Use existing option".

I could then select GitHub as a source control location and direct it to use that when setting up my build and release templates. The next step included setting up the VSTS project I wanted to use, for this I created a new instance. Earlier I had deployed my azure function but the wizard didn't want to let me select and existing azure resource so I ended up creating a new one with a better name.

It takes a little while for the project to be setup but once it's finished you get a portal like the one below. You can see it has already taken my code from GitHub, started a build process and attempted a deployment to an azure resource. The portal provides links to azure endpoints, source control, build templates, backlog items and logging. I don't know about you, but I think that is extremely cool and really powerful. If I am managing 5-10 services I now have an easy platform to view both development and realease health of a project.

Now you may have noticed the big red X next to the build of my project. As I said before this isn't perfect, the wizard isn't going to get everything right and I never expected I wouldn't have to manually modify some of the definitions it created. So lets fix that build.

Looking at that error the wizard didn't make the mistake I was the one that made the mistake when setting up the wizard. I thought since I'm using a .net core function I want a .net core build. I could delete the project and recreate another one but lets jump into the build templates and change it over instead.


This is the build template that they setup for my project,
