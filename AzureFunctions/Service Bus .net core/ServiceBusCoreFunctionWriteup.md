I've been playing around with azure functions and azure service bus for the last few months.
Most of the stuff I've been playing with has been using the .net framework as at the
time of writing things tend to just work out of the box with .net framework, where as .net core
and .net standard require a bit of mucking around.

This article will give you a quick run down of how to setup an azure function in C# using .net core, visual studio 2017 and azure. I'm a pretty verbose sort of person since
it's so easy to get stuck because you missed a single install step but if you're just after the code and project config feel free to scroll past all the setup steps.


So first things first make sure you have a copy of visual studio installed, for the purpose of this article I was using a community edition but any
edition should work the same. When I first tried to create an azure function project in visual studio I found I hadn't installed the  visual studio didn't have the packages
installed. No worries there's a link on the create a project page which opens the visual studio installer, from here I just needed to select the azure development workflow.

Once that was installed when I search for azure function in the new project wizard it shows up I'm then able to create an azure function for my project. At the time of writing this
the wizard does not provide a service bus topic option so you'll have to create an empty project and then you can right click -> add new function and select service bus topic from the list.
This will create something similar to the following, one change that I made was to use the `Microsoft.Extensions.ILogger` instead of the TraceWriter. The Microsoft team appear to be working on a way
to utilize dependency injection but that might be a while off but it doesn't stop us from setting up our code to handle it when it is supported.

```C#
    public static class ServiceBusReader
    {
        [FunctionName("ServiceBusReader")]
        public static void Run([ServiceBusTrigger("NewSubscriptions", "SendSignupEmail", Connection = "ServiceBusRootConnectionString")]string mySbMsg, ILogger log)
        {
            log.LogInformation($"C# ServiceBus topic trigger function processed message: {mySbMsg}");
        }
    }
```
```JSON
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "AzureWebJobsDashboard": "UseDevelopmentStorage=true",
            "ServiceBusRootConnectionString": "<RootConnectionString>"
        },
        "Host": {
            "serviceBus": {
                "maxConcurrentCalls": 1,
                "prefetchCount": 0,
                "autoRenewTimeout": "00:05:00"
            },
            "logger": {
                "categoryFilter": {
                    "defaultLevel": "Information",
                    "categoryLevels": {
                        "Host": "Error",
                        "Function": "Error",
                        "Host.Aggregator": "Information"
                    }
                }
            }
        }
    }
```

In order to get the code to work I needed to modify the local.settings.json file to provide the ServiceBusConnectionString parameter, I also added a host property there so we can start getting familiar with that.
The host property allows you to define custom host configuration while running locally, in this we've set that we only want to run a single function at a time and that we want to use the ILogger for information and error calls.

After I got this setup the first step I had was to get it running on my local machine and able to trigger through postman. I had hoped to set this up without using an actual azure service bus property
but unfortunately it doesn't look like there's an emulator for the service bus currently and for the function to setup correctly you need a valid connection string. The initialization checks for
null and empty strings and does further validation, even if you pass fake values. At this point I just added my connection string and started running the function.

Success, I now have a function running on my local machine on port 7071, now all I need to do is trigger it. In the above function we are using the parameter `string mySbMsg` so we are only providing a string. Azure functions
has a special url for testing functions that aren't http triggered as if they were. We just need to do a post to

Url|http://localhost{port}/admin/functions/{functionName}
Body|     ```JSON
          {
              "input": "test plain text message"  
          }
          ```
ContentType|application/json        

This should cause the console from the running azure function to output a message. You now have tested that the function is running locally and you're able to trigger the code within it. It is possible to use a custom class as a
parameter to your azure function and it will get deserialized before your code is called but that requires the message to be sent to the service bus in a particular format so for now I'm going to concentrate on getting a `byte[]`
for now. Another reason for not using a custom object is that you might find you don't want to use Json for serializing your data but rather a non human readable format to reduce your message size.

So in order to read a meaningful object from the byte[] we want to deserialize it and add some logic around it, for now I've just added some logging for different conditions.

```C#
    public static class ServiceBusReader
    {
        [FunctionName("ServiceBusReader")]
        public static void Run([ServiceBusTrigger("NewSubscriptions", "SendSignupEmail", Connection = "ServiceBusRootConnectionString")] byte[] structuredMessage, ILogger log)
        {
            SignupInformation newAccount = DeserializeJsonMessage<SignupInformation>(structuredMessage);
            if (newAccount.AccountExists)
            {
                log.LogInformation("fix the filter on your subscription to prevent this.");
            }

            log.LogInformation($"C# ServiceBus topic trigger function processed message with email: {newAccount.EmailAddress}");
        }

        private static T DeserializeJsonMessage<T>(byte[] message)
        {
            string jsonContent = Encoding.UTF8.GetString(message);
            return JsonConvert.DeserializeObject<T>(jsonContent);
        }
    }

    public class SignupInformation
    {
        public bool AccountExists { get; set; }
        public string EmailAddress { get; set; }
    }
```

I then need to update my postman content to match this new data type as follows, notice how the input is still a string so you need to escape the quote characters.

```JSON
    {
    	"input": "
    	    {
    	    	\"AccountExists\": \"false\",
    	    	\"EmailAddress\": \"test@mailinator.com\"    	    	
    	    }"
    }    
```

that's all I want to have functionally for this function so now that we've tested it's working locally it's time to use the actual service bus to trigger our local function.



* https://github.com/Azure/azure-webjobs-sdk/wiki/ServiceBus-Serialization-Scenarios - service bus parameters and how to create them.
* https://github.com/Azure/azure-webjobs-sdk/issues/979 - issue with POCO requiring special creating rather than just working with json data.
* https://docs.microsoft.com/en-us/azure/azure-functions/functions-host-json - host docs
* https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local - core tools for local docs  
* https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#local-settings-file - local settings docs.
