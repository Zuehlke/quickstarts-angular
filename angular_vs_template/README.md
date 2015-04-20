**Visual Studio Project Template for developing AngularJS applications with .NET backend**
------------------------------------------------------------------------

.NET folks love Visual Studio. If you are about to develop an AngularJS application with .NET backend and do not want to leave the comforting environment of Visual Studio this template is for you! The mainstream technologies in JavaScript development such as Grunt, Node and Bower are integrated into the Visual Studio build so you basically have the best of two worlds in one place.

**Getting Started**
--------------

 1. Clone this template
 2. Load the solution in Visual Studio
 3. Rebuild (first Rebuild may take a while, because all NuGet, npm and bower dependencies get installed)
 4. Configure virtual directory for iisexpress to use it from within Visual Studio (for debugging):
	 -  Go to project properties --> Web --> Click on "Create Virtual Directory"
	 -  Open C:\Users\[you]\Documents\IISExpress\config\applicationhost.config
	 -  Look for the entry which looks something like this:

   ```xml
   <site name="www" id="40">
         <application path="/" applicationPool="Clr4IntegratedAppPool">
               <virtualDirectory path="/" physicalPath="[Path to Folder]" />
         </application>
         <bindings>
              <binding protocol="http" bindingInformation="*:[Port]:localhost" />
         </bindings>
    </site>
    ```
    and change this line:

    ```xml
    <virtualDirectory path="/" physicalPath="[Path to Folder]" />
    ```
     to look like this:
     ```xml
     <virtualDirectory path="/" physicalPath="[Path to Folder]\bin\Debug" />
      ```
      The reason we need to do this is because iisexpress will try to serve from the project's root directory. It is unfortunately not possible to configure the physical path in Visual Studio.
 5. Start the application


Alternatively, if you are comfortable with cli tools and grunt you can simply execute:
```
npm install
bower install
grunt
```
This will install all dependencies, invoke MSBuild, start the application in iisexpress and start the "watch" task which monitors code files for changes. One thing you don't get though is the automatically attached debugger.

**What you get**
--------------
This template extends the [Static Web Content Template](https://visualstudiogallery.msdn.microsoft.com/4dd0b2a8-5eb2-4e56-9376-bc23e01d5ce0) making it possible to put the .NET backend and the JavaScript frontend  into the same Visual Studio project. This comes in rather handy if you want to avoid CORS issues.  The Visual Studio project itself is of type "Web Application" which allows for hosting it in iisexpress directly from within Visual Studio providing the rich debugging experience we are all used to.

What you get with this template is an AngularJS application written in TypeScript which consumes a simple Web API web service. This way you have a good starting point for further development.

After a successful build you will find "bin\Debug" and "bin\Release" folders.
"bin\Debug" contains all the application files needed for active development and debugging. "bin\Release" contains the Release version of the application, meaning that all JavaScript and css files are bundled and minified.

This template is publish-ready. Under the "Properties" folder you will find a publish profile (product_prod.pubxml) for MSDeploy publishing where you are supposed to replace all TODOs with you data.
Beyond that there is a .wpp.targets file which describes what should be actually published. "bin\Release" folder is configured to be the source directory.

**Developer's guide**
--------------
**Changes to the backend:** build and restart for every change.

**Changes to the frontend:** gruntfile is the place where all the front end stuff gets handled. One thing the gruntfile does not do though is compiling TypeScript which is completely handled by Visual Studio.
It means that the gruntfile assumes that the .js and .map files are up to date. Visual Studio will compile TypeScript on every file save and build (MSBuild) by default.  
The normal workflow for frontend development would be as follows:
**Rebuild --> Start --> Run "grunt watch".**  
The Grunt "watch" task will monitor your files (.js, .less, .html) for changes and synchronize those changes with your "bin\Debug" folder. So after you applied your changes just hit F5 to refresh the application in the browser (livereload is not possible with iisexpress). If you change any unit tests they will be executed right away.

Overview over the Grunt tasks:

- clean: cleans output directory
- copy: copies files
- concat: concatenates multiple .js / .less files to one single file
- uglify: minifies .js / .less files
- less: compiles .less files
- html2js: puts all html template files into the AngularJS template cache
- sync: synchronizes directories (copies changed files only)
- watch: watches for file changes and triggers actions
- karma: runs js unit tests
- msbuild: runs MSBuild
- iisexpress: runs iisexpress
- index: handles index.html as grunt teplate file

Configuration (paths, files, etc.) for the gruntfile is found in build.config.js



For the list of dependencies please refer to:
- packages.config --> NuGet  
- package.json --> npm  
- bower.json --> Bower

**Known Issues**
--------------
1. Visual Studio will eventually overwrite your iisexpress virtual directory configuration and try to serve from the project's root directory. We are currently looking for a solution to this problem.

2. Web Essentials plugin for Visual Studio may cause problems if it interferes with grunt tasks. So one should completely disable less compilation and css minification which is done by a grunt task. Otherwise Web Essentials will generate .css and .min.css files and also add them as dependencies to the .csproj which is bad as we do not want to check in generated stuff.
