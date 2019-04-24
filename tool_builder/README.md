# Lumi Box Tool Builder

A tool is any software that can be installed and operated on a Lumi Box. It's a `.tar` file with a specific set of files and scripts in the `tool` folder.


## Building and Packing

Set your working directory

	$ cd tool_builder

Make sure the scripts are executable

	$ chmod +x pack.sh build_image.sh

Build and store the Docker image. Possible targets can be identified by the existence of a `package<target>` folder.

	$ ./build_image.sh <tool folder> [<target>]

Create a compressed tar file that can be installed on box

	$ ./pack.sh <tool folder> [<target>]
	
### Example
	
	$ ./pack.sh example

	$ ./build_image.sh hello _x86
	
	$ ./pack.sh hello _x86


## File Structure

	|-package               // content of the tar file
	| |-tool
	| | |-meta.json         // contains information about the tool
	| | |-install.sh
	| | |-remove.sh
	| | |-start.sh
	| | |-stop.sh
	| | '-status.sh         // should echo `0` if tool is not running
	| |
	| '-...
	|
	|-package<target>       // target-specific content of the tar file
	| '-...
	|
	'-src                   // files used for image-building
	  '-...

### meta.json

	{
		"name": "foo",
		"icon": "path/to/icon.file" // relative to 'package'
	}