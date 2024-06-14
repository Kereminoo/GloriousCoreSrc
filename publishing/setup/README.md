- Run the `npm run package` command to package the project into an executable in the `out/Glorious Core-win32-x64` directory.
- Copy the contents of the `out/Glorious Core-win32-x64` directory into the `publishing/files` directory.
- Open the 'Core Setup Packager.iss' file with the InnoSetup app (website: https://jrsoftware.org/isdl.php; direct download: https://jrsoftware.org/download.php/is.exe).
- Use the 'Build' menu, or `Ctrl + F9` to Compile the Files content into a setup package in the 'setup' directory.

After completing the above steps, the installer will be packaged into an MSI executable. For publishing, this file should be renamed to include the current release build number and compressed into an archive for hosting.