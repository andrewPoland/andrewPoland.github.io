# Stop doing manual shit

I do way too much manual work. I am guilty of right click publishing projects. I am guilty of manually running tests.

>The definition of insanity is doing the same thing over and over and expecting different results

I often feel like I'm crazy when I make a code change and I manually run a test with the same inputs, expecting the same outputs and getting the same results 90% of the time. So why waste my time when I can get a robot to do it for me?

A few weeks ago I watched a dev-ops video from Build and it got me genuinely excited. Azure offers what they call DevOps Projects. These projects attempt to automate the setup of everything you might need to make that initial leap into the world of automation. They're not perfect, it's in preview and it doesn't set everything up, but it points you in the right direction. This is valuable if you've never set anything like this up before.

## What does it give you?

1. Visual Studio Team Services (VSTS) project for tracking work.
2. Build template inside VSTS project which pulls from source code.
3. Release template inside VSTS which deploys to azure.
4. Create the azure resources for you (what is configured through wizard).
5. Application Insights instance for monitoring azure resources.
6. Optional: Git repository in VSTS.

## How do I set it up?

This is one of the rare azure tools you actually want to setup from the portal, so from the portal if you search for DevOps it should show up like below.

![Azure DevOps Project in wizard](/Assets/DevopsProject/Images/DevopsProjectInPortal.png)

Once you've clicked through to creating a DevOps Project, it presents you with the following wizard. There are multiple streams you can take here, the wizard supports creating new projects, where you choose the language and azure resources that you want to create. In my case I'm using the azure function code I wrote about earlier, so I went with the "Use existing option". I could then select GitHub as a source control location and direct it to use that when setting up my build and release templates.

![DevOps Project wizard source control step](/Assets/DevopsProject/Images/WizardOwnCodeStepOne.png)

I then got to choose what service I wanted to use, currently they don't have an Azure Function option, Web Apps are pretty close to Azure Functions so I thought I'd roll the dice and see what happens.

![Devops Project Wizard Azure service step](/Assets/DevopsProject/Images/WizardOwnCodeStepThree.png)

The next step included setting up a Visual Studio Team Services (VSTS) project. I created a new instance of VSTS along with a new resource group which means all new resources. I haven't been able to find out if there is a way to import existing resources into a new DevOps Project.

It takes a little while for the project to be setup but once it's finished, you get a portal like the one below. You can see it has already taken my code from GitHub, started a build process and attempted a deployment to an azure resource. The portal provides links to azure endpoints, source control, build templates, backlog items and logging. I don't know about you, but I think that is extremely powerful. If I am managing 5-10 services I now have an easy platform to view both the development and release health of a project.

![Initial portal view](/Assets/DevopsProject/Images/DevopsPortal.png)

Now you may have noticed the big red X next to the build of my project. As I said before, it's preview and this isn't perfect. The wizard doesn't support Azure Functions and so I ended up with what I asked for, a Web App. That means a Web App in azure as well as a build/release template setup for a Web App.

My first issue was the build template that they setup for my project. I found that the ".net core installer version" that the wizard setup wasn't valid, so it couldn't resolve the [sdk version](https://github.com/dotnet/core/blob/master/release-notes/releases.csv) to use. Easy fix and after modifying to 2.0.0 this section got a tick.  

![Installer configuration change](/Assets/DevopsProject/Images/InstallerVersionNumber.png)

I then found since I had said I was making a Web App inside the wizard, the publish section was looking for a web.config file. Removing this option and telling it to publish all .csproj files got this section a tick too.

![Edited publish configuration](/Assets/DevopsProject/Images/FinalPublishConfiguration.png)

I now had a build completing and it was time to setup the release. The release was attempting to deploy to an App Service that the DevOps Project had setup in azure. My goal was to get this deploying to an azure function instead. To solve this I deleted the App Service and created an Azure Function with the same name. I then went into the release that was already setup, navigated to the task section and opened up the "Deploy Azure App Service" task. Conveniently Azure functions are deployed inside the same task, so all I had to do was change the "App Service Type" to Function App. Earlier in my build steps I had modified them to build and publish all .csproj files. This meant that I had two zip files since I had to projects in the solution, instead of just one. By default it was looking for a single zip file to publish, so to fix that up I had to specify the specific zip filename to look for.

![Completed deploy task configuration](/Assets/DevopsProject/Images/CompletedDeployConfig.png)

Once I had made these modifications, my build and release were finally working and I was able to view this in the DevOps Project portal. I then went to test my new Azure Function using my App Insights instance but once again I hit a snag. Nothing was showing up and my function wasn't triggering. It took me longer than I care to admit, to find that the reason was I hadn't configured my function. I went to the portal and added the instrumentation key, service bus connection string and *most importantly the Functions_Extension_Version* settings. Why is that one the most important? well if you are running a .net core Azure Function without that setting set to "beta", your function will not run.  

![Azure Function configuration](/Assets/DevopsProject/Images/CompletedDeployConfig.png)

##Was all that worth it?

![Final DevOps Project portal view](/Assets/DevopsProject/Images/FunctionDevopsProject.png)

So after all that work what did I actually get?

when I push to GitHub, I get

1. A build triggered automatically.
2. Any existing tests are run as part of that build.
3. A release to a development environment.
4. App insights monitoring my environment.
5. A portal which reports to me the status of all the above items.

Irrelevant of DevOps Projects all the items from 1-3 are essential items, if you're working on a project that doesn't provide this, you have a problem that needs fixing. I still like the portal and would opt for it rather than against it but if it doesn't meet your needs just get 1-3 working manually so you never have to manually trigger a release again.  

My biggest problem with the process I've gone through above, was that I was still doing manual shit. I still created and configured my azure function manually, that sucks, why did I do that. Now when I want to create another environment, I'm going to have to do more manual shit. Now when configuration changes, I'm going to have make sure I don't introduce human error across all my environments. If you end up with 6 environments across 5-10 different projects, doing thing manually is going to be hell. So in my next post I'm going to concentrate on getting rid all that manual work using Terraform.
